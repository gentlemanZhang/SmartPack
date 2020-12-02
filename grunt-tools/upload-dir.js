module.exports = function( grunt, {outputFolder, year, name}  ) {
    // 上传指定目录到images.koolearn.com服务器（必须先打包到dist目录中）
    grunt.registerTask( 'upload', function() {
        if(!year || !name || year > 2050 || year < 1970) return grunt.log.warn('没有填入年份或者名称')
        var dir = `./${outputFolder}/${name}`;
        grunt.log.ok( 'upload-dir: ' + dir);
        // 判断项目是否存在
        var bprojectDir = grunt.file.isDir( dir );
        if( bprojectDir ) {
            grunt.log.ok( `准备发布 ${outputFolder}/${name} 目录到images.koolearn.com服务器\n\n` );
            grunt.config.set( 'ftp-deploy', {
                images: {
                    auth: {
                        // host: '172.18.32.150',
                        // 今后请务必使用域名上传文件，否则可能出现文件上传失败的问题
                        // 为防止外网文件被意外修改或删除，运维帮忙设置了从内网到外网增量同步的逻辑
                        // 即每分钟同步一次内网（uiftp指向的地址）比外网(32.150)新的文件
                        // 且32.150ftp上传权限被回收，无法直接更新
                        // 上传成功后如果需要cdn清除缓存，需要等1分钟后在进行操作
                        host: 'uiftp.koolearn.com',
                        port: 21,
                        authPath: './grunt-tools/config/ftppass.json',
                        authKey: 'images.koolearn.com'
                    },
                    src: dir,
                    dest: `/images/shark/project/zt/${year}/${name}`
                }
            } );
            grunt.task.run( 'ftp-deploy' );
        } else {
            grunt.log.error( '没有这个目录，此任务只能上传目录' );
            return false;
        }
    } );
};
