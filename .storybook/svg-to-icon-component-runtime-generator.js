const path = require('path');
const pascalCase = require('pascal-case');
const { stringifyRequest } = require('loader-utils');
const { stringifySymbol, stringify } = require('svg-sprite-loader/lib/utils');

module.exports = function runtimeGenerator({ symbol, config, context, loaderContext }) {
  const { spriteModule, symbolModule, runtimeOptions } = config;
  const compilerContext = loaderContext._compiler.context;


  const spriteRequest = stringifyRequest({ context }, spriteModule);
  const symbolRequest = stringifyRequest({ context }, symbolModule);
  const parentComponentDisplayName = 'SpriteSymbolComponent';
  const displayName = `${pascalCase(symbol.id)}${parentComponentDisplayName}`;
  const stringifiedSymbol = stringifySymbol(symbol);

  return `
    import React from 'react';
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};
    import ${parentComponentDisplayName} from "@components/base/Icon/SpriteSymbolComponent";
    
    const symbol = new SpriteSymbol(${stringifiedSymbol});
    sprite.add(symbol);
    export default class ${displayName} extends React.Component {
      render() {
        return <${parentComponentDisplayName} glyph="${symbol.id}" {...this.props} />;
      }
    }
  `;
};