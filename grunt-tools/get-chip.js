// 批量更新专题的碎片到本地
var fs = require( 'fs' );
var path = require( 'path' );
var async = require( 'async' );
var request = require( 'request' );
var querystring = require( 'querystring' );
var successCode = 5008;
const util = require('./util/util.js');

module.exports = function( grunt, {outputFolder, year, name}) {
    grunt.registerTask( 'get-chip', function( name ) {
        var endTask = this.async();
        var files = getHtmlLists( name );
        if( files.length == 0 ) {
            console.log( '<span class="err">该专题没有要更新的模板。</span>' );
            return false;
        }
        files.forEach( function( file ) {
            console.log( grunt.file.isFile( file.name.slice( 1 ) ) );
        } )
        // 顺序上传，禁止并发
        async.eachSeries( files, updateChip, function( err ) {
            console.log( '碎片更新完毕' );
            endTask( true );
        } );

    } );
    function updateChip( item, done ) {
        var ejsName = item.name;
        var htmlName = `/project/zt/${year}/${name}/chip/` + item.name.replace(/\.ejs$/, '.html').split('/').reverse()[0];
        var url = getGetDataUrl( htmlName );
        console.log(url);
        request( url, function( err, res, body ) {
            var result = JSON.parse( body );
            var data;
            if( res.statusCode == 200 && result.state == successCode ) {
                console.log( '正在更新碎片: ' + result.data.name );
                var data = result.data.data;
                grunt.file.write( ejsName.slice( 1 ), data );
            } else {
                console.log( '查询失败！' );
            }
            done( null );
        } );
    }
}

function getGetDataUrl( name ) {
    var data = {
        name: name
    };
    data = querystring.stringify( data );
    var url = 'http://apiproduct.koolearn.com/special/getid?' + data;
    return url;
}

// 获取待上传的文件列表
function getHtmlLists( ztName ) {
    return util.getSpecificTypFiles( `src/chip`, /\.ejs$/ );
}
