
let Client = require('ssh2-sftp-client');
let path = require('path');
let fs = require('fs');
let util = require('./util/util.js');
var async = require( 'async' );

// 读取neibu-dist里的所有文件
function readFileToArraySync(dir){
    return util.deepReduce(fs.readdirSync(dir).map(item => {
        if(fs.statSync(dir+item).isDirectory()){
            return readFileToArraySync(dir+item+'/').map(_item => {
                return item + "/" + _item;
            });
        }else{
            return item;
        }
    }))
}

// 读取neibu-dist里的所有文件夹
function readDirectoryToArraySync(dir){
    return util.deepReduce([dir].concat(
        fs.readdirSync(dir)
        .filter(item => {
            return fs.statSync(dir+item).isDirectory();
        })
        .map(item => {
            return readDirectoryToArraySync(dir+item+'/')
        })
    ));
}

// 组合readFileToArraySync函数和readDirectoryToArraySync函数
function readDirFileAndDirectory(dir){
    return {
        filePath: readFileToArraySync(dir),
        directoryPath: readDirectoryToArraySync(dir).map(item => item.replace(dir, '')),
    }
}

module.exports = function( grunt, {outputFolderNeibu, year, name}  ) {
    // 上传指定目录到images.koolearn.com服务器（必须先打包到dist目录中）
    grunt.registerTask( 'upload-neibu', function() {
        if(!year || !name || year > 2050 || year < 1970) return grunt.log.warn('没有填入年份或者名称')
        var dir = `./${outputFolderNeibu}/${name}/`;
        grunt.log.ok( 'upload-dir-neibu: ' + dir);
        // 判断项目是否存在
        var bprojectDir = grunt.file.isDir( dir );
        if( bprojectDir ) {
            var done = this.async();
            var nowDate = Date.now();
            grunt.log.ok( `准备发布 ${outputFolderNeibu}/${name} 目录到 ui.trunk.koolearn.com 服务器\n\n` );
            let sftp = new Client();
            let remotePath = `/tol/www/zt-neibu-demo.ui.koolearn-inc.com/dist/project/zt/${year}/${name}/`;
            let readDir = readDirFileAndDirectory(dir);
            sftp.connect({
                host: '10.155.20.133',
                port: 22,
                username: "develop",
                password: "develop"
            }).then(() => {
                return sftp.exists(remotePath);
            }).then((flag) => {
                if(flag){
                    grunt.log.ok('\n');
                    grunt.log.ok(`即将删除${remotePath}文件夹: \n`);
                    return sftp.rmdir(remotePath, true);
                }
                else return '';
            }).then(() => {
                grunt.log.ok('\n');
                grunt.log.ok('即将在服务器创建以下文件夹: \n');
                grunt.log.ok(readDir.directoryPath.map(item => remotePath + item).join('\n'));
                grunt.log.ok('=========================\n');
                grunt.log.ok('\n');
                // Promise队列实现
                return readDir.directoryPath.reduce((promise,item) => {
                    return promise.then(()=>{
                        return sftp.mkdir(remotePath + item, true);
                    })
                }, Promise.resolve());
            }).then(() => {
                grunt.log.ok('创建路径成功\n');
                grunt.log.ok('即将发布以下文件: \n');
                grunt.log.ok(readDir.filePath.join('\n'));
                grunt.log.ok('=======================\n');
                grunt.log.ok('\n');
                return readDir.filePath.reduce((promise,item) => {
                    return promise.then(()=>{
                        return sftp.put(dir + item, remotePath + item);
                    })
                }, Promise.resolve());

            }).then(() => {
                sftp.end();
                grunt.log.ok( 'take time:', Date.now() - nowDate );
                grunt.log.ok('\n');
                grunt.log.ok('\n');
                grunt.log.ok( `上传完成，请访问 https://ui.trunk.koolearn.com/zt-neibu/project/zt/${year}/${name}/` );
                grunt.log.ok('\n');
                grunt.log.ok('\n');
                done(true);
            }).catch((err) => {
                console.log('发生错误: \n', err);
                done(false);
            });
        } else {
            grunt.log.error( '没有这个目录，此任务只能上传目录' );
            return false;
        }
    } );
};
