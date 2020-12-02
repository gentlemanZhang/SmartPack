var fprocess = require( 'child_process' );
module.exports = function(grunt, pkg) {
    grunt.loadNpmTasks('grunt-ftp-deep');
    const {year, name, outputFolder, outputFolderNeibu} = pkg;

    // 获取碎片
    require('./get-chip')(grunt, {outputFolder, year, name} );
    // 更新线上碎片
    require('./update-chip')(grunt, {outputFolder, year, name});
    // 更新内部环境模板
    require('./update-neibu-tpl')(grunt);
    // 更新线上模板
    require('./update-tpl')(grunt, {outputFolder, name});
    // 自动上传目录
    require('./upload-dir')(grunt, {outputFolder, year, name});
    // 上传到neibu目录
    require('./upload-dir-neibu')(grunt, {outputFolderNeibu, year, name});

    grunt.registerTask('publish-zt', function(){
        console.log( `开始上传 ${outputFolder}/${name} 目录` );
        var done = this.async();
        var nowDate = Date.now();
        fprocess.exec( 'grunt upload', function(err, result){
            if( !err ) {
                grunt.log.ok( '上传完毕！' );
            } else {
                console.log( err );
                done( false );
            }
            console.log( '开始上传专题模板' );
            fprocess.exec( 'grunt update-tpl', function(err, result){
                if( !err ) {
                    console.log( result );
                } else {
                    console.log( err );
                    done( false );
                }
                grunt.log.ok( 'take time:', Date.now() - nowDate );
                done( true );
            })
        })
    })

    grunt.registerTask('publish-neibu', function(){
        console.log( `开始上传 ${outputFolderNeibu}/${name} 目录` );
        var done = this.async();
        var nowDate = Date.now();
        fprocess.exec( 'grunt upload-neibu', function(err, result){
            if( !err ) {
                grunt.log.ok( `上传完毕，请访问https://ui.trunk.koolearn.com/zt-neibu/project/zt/${year}/${name}/` );
                grunt.log.ok( 'take time:', Date.now() - nowDate );
                done( true );
            } else {
                console.log( err );
                done( false );
            }
        })
    })
}