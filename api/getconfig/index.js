module.exports = async function (context, req) {
    context.log('Configuration quest ');
  
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "url": process.env.API_URL
        }
    };
}