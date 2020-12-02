var fs = require( 'fs' );
var path = require( 'path' );
module.exports = {
    // 通用的列表读取函数
    getSpecificTypFiles:function( dir, rtype ) {
        var lists;
        try {
            lists = fs.readdirSync( dir );
        } catch( e ) {
            console.log( '不存在此目录: ' + dir );
            console.log(e);
            process.exit( 1 );
        }
        // console.log(lists);
        return lists.filter( function( name ) {
            // 重置搜索起始位置
            rtype.lastIndex = 0;
            return rtype.test( name );
        } ).map( function( name ) {
            var pathname = path.normalize( process.cwd() + `/${dir}/${name}` ).replace( /\\/gi, '/' );
            var data = fs.readFileSync( pathname, { encoding: 'utf-8' } );
            return {
                name: path.normalize( `/${dir}/${name}` ).replace( /\\/gi, '/' ).replace(/\/\//gi, '/'),
                filename: name,
                pathname: path.normalize( process.cwd() + '/' + dir + '/' + name ).replace( /\\/gi, '/' ),
                data: data
            };
        } );
    },
    deepReduce: function(array){ // 抚平任意高维的数组，变成一维
        return array.reduce((val, item) => {
            if(Array.isArray(item)){
                return val.concat(this.deepReduce(item));
            }else{
                return val.concat([item]);
            }
        }, []);
    },
}
