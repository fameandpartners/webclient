import React, { PureComponent } from 'react';

interface BasicIconForSvgSprite {
    glyph: string;
    className?: string;
}

export default class SpriteSymbolComponent extends PureComponent<BasicIconForSvgSprite> {
  public render() {
    const {className, glyph, ...restProps} = this.props;

    return (
      <svg className={className} {...restProps}>
        <use xlinkHref={`#${glyph}`} />
      </svg>
    );
  }
}