#!/usr/bin/env node

var fs = require( 'fs' );
var path = require( 'path' );
var async = require( 'async' );
var request = require( 'request' );
var successCode = 5008;
const util = require('./util/util.js');

module.exports = function( grunt , {outputFolder, year, name} ) {
    grunt.registerTask( 'update-chip', function() {
        var endTask = this.async();
        var files = getHtmlLists( outputFolder, name );
        if( files.length == 0 ) {
            console.log( '该专题没有要更新的模板。' );
            return false;
        }

        console.log( '开始上传碎片：' );
        //顺序上传，禁止并发
        async.eachSeries( files, updateChip, function( err ) {
            console.log( '碎片上传完毕' );
            endTask( true );
        } );
    } );
    function updateChip( item, done ) {
        item.name = `/project/zt/${year}/${name}/chip/${item.filename}`;
        request.post( 'http://apiproduct.koolearn.com/special', {
            form: item
        }, function( err, res, body ) {
            var result = JSON.parse( body );
            if( res.statusCode == 200 && result.state == successCode ) {
                console.log( item.name + ': 上传成功, 碎片id: ' + (result.data && result.data.id) );
            } else {
                console.log( item.name + ': 上传失败' );
            }
            //console.log( body );
            done( null );
        } );
    }
}

// 获取待上传的文件列表
function getHtmlLists( outputFolder, name ) {
    return util.getSpecificTypFiles( `${outputFolder}/${name}/chip`, /\.html$/ );
}


