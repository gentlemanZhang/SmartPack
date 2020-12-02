// 上传专题模板到指定目录

var fs = require( 'fs' );
var path = require( 'path' );
var JSFtp = require( "jsftp" );
var async = require( 'async' );

module.exports = function( grunt ) {
    grunt.registerTask( 'update-neibu-tpl', function( name ) {
        var endTask = this.async();
        var type = getZtType( name );
        var htmlLists = getHtmlLists( name );
        var length = htmlLists.length;
        if( length === 0 ) {
            console.log( '该专题没有要上传的模板，请将要上传的模板放在专题的根目录下！' );
            return true;
        }
        var path = 'manage/phpcms/templates/' + type + '/special';
        var Ftp = new JSFtp( {
            host: "10.155.10.72",
            port: 21,
            user: "yinkun",
            pass: "yinkun"
        } );

        console.log( '建立ftp链接：' );

        Ftp.raw.cwd( path, function( err ) {
            if( err ) {
                console.log( '没有 ' + type + ' 类型的专题，专题类型设置错误，请检查，上传失败！' );
                exiteFtp( 1 );
            } else {
                async.eachSeries( htmlLists, function( item, done ) {
                    Ftp.put( item.pathname, item.name, function( err ) {
                        if( err ) {
                            console.log( item.name + ' 上传错误！' );
                        } else {
                            console.log( item.name + ' 上传至 ' + type + '类目下' );
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
            Ftp.raw.quit( function( err, data ) {
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

// 通用的列表读取函数
function getSpecificTypFiles( dir, rtype ) {
    var lists;
    try {
        lists = fs.readdirSync( dir );
    } catch( e ) {
        console.log( '不存在此目录: ' + dir );
        process.exit( 1 );
    }
    lists = lists.filter( function( name ) {
        // 重置搜索起始位置
        rtype.lastIndex = 0;
        return rtype.test( name );
    } );
    lists = lists.map( function( name ) {
        return {
            pathname: path.normalize( process.cwd() + '/' + dir + '/' + name ).replace( /\\/gi, '/' ),
            name: name
        };
    } );
    return lists;
};

// 获取待上传的文件列表
function getHtmlLists( ztName ) {
    return getSpecificTypFiles( 'dist/project/' + ztName, /\.html$/ );
}

// 获取专题类型
function getZtType( ztName ) {
    var file = getSpecificTypFiles( 'project/' + ztName, /\.json$/ )[ 0 ];
    if( !file ) process.exit( 1 );
    var obj = JSON.parse( fs.readFileSync( file.pathname ) );
    var ztType = obj[ 'ztType' ];
    if( !ztType ) {
        console.log( '<span class="err">该专题没有分配专题类型，请检查！</span>' );
        process.exit( 1 );
    }
    return ztType;
}