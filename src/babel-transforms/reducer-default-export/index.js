const babelTemplate = require('@babel/template').default;

const buildDefaultExport = babelTemplate(
  `export default (state = {}, action) => {
  const { type, payload, error } = action;
   
   switch(type){
       
     default:
       return state;
       
   }
 }`,
  {
    sourceType: 'module',
    plugins: ['objectRestSpread']
  }
);

module.exports = ({ types: t }) => ({
  name: 'holon-reducer-default-export',
  visitor: {
    Program(rootPath) {
      let defaultExportPath;
      rootPath.traverse({
        ExportDefaultDeclaration(path) {
          defaultExportPath = path;
        }
      });

      if (!defaultExportPath) {
        rootPath.pushContainer('body', buildDefaultExport());
      }
    }
  }
});
