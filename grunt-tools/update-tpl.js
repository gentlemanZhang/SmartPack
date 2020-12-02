// 上传专题模板到指定目录

var fs = require( 'fs' );
var path = require( 'path' );
var JSFtp = require( "jsftp" );
var async = require( 'async' );
const util = require('./util/util.js');

module.exports = function( grunt, {outputFolder, name} ) {
    grunt.registerTask( 'update-tpl', function( ) {
        var endTask = this.async();
        var type = getZtType();
        var htmlLists = getHtmlLists( outputFolder, name );
        var length = htmlLists.length;
        console.log('update-tpl:');
        if( length === 0 ) {
            console.log( '该专题没有要上传的模板，请将要上传的模板放在专题的根目录下！' );
            return true;
        }
        var path = 'manage/phpcms/templates/' + type + '/special';
        var Ftp = new JSFtp( {
            host: "cmsftp.koolearn.com",
            port: 21,
            user: "yinkun",
            pass: "YW@Q2!ZW!Mx"
        } );

        console.log( '建立ftp链接：' );

        Ftp.raw('cwd', path, function( err ) {
            if( err ) {
                console.log( '没有 ' + type + ' 类型的专题，专题类型设置错误，请检查，上传失败！' );
                exiteFtp( 1 );
            } else {
                async.eachSeries( htmlLists, function( item, done ) {
                    Ftp.put( item.pathname, item.filename, function( err ) {
                        if( err ) {
                            console.log(err)
                            console.log( item.filename + ' 上传错误！' );
                        } else {
                            console.log( item.filename + ' 上传至 ' + type + '类目下' );
                        }
                        done( null );
                    } );
                }, function( err ) {
                    console.log( '专题模板上传完毕' );
                    exiteFtp( 0 );
                } );
            }
        } );

        function exiteFtp( status ) {
            Ftp.raw('quit', function( err, data ) {
                if( err ) return console.error( err );
                console.log( 'ftp链接关闭' );
                if( status == 0 ) {
                    endTask( null );
                } else {
                    process.exit( 1 );
                }
            } );
        }

    } );
}

// 获取待上传的文件列表
function getHtmlLists( outputFolder, name ) {
    return util.getSpecificTypFiles( `${outputFolder}/${name}`, /\.html$/ );
}

// 获取专题类型
function getZtType() {
    var obj = JSON.parse( fs.readFileSync( './package.json' ) );
    if( !obj ) process.exit( 1 );
    var ztType = obj[ 'ztType' ];
    if( !ztType ) {
        console.log( '<span class="err">该专题没有分配专题类型，请检查！</span>' );
        process.exit( 1 );
    }
    return ztType;
}
