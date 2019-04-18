import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
const SearchIcon = require('@svg/i-search.svg').default;

storiesOf('Layout/Base', module).add('Typography', () => (
    <div>
        <h1>H1: Far far away, behind the word mountains</h1>
        <h2>
            H2: Far far away, behind the word mountains, far from the countries{' '}
        </h2>
        <h3>
            H3: Far far away, behind the word mountains, far from the countries{' '}
        </h3>
        <h4>
            H4: Far far away, behind the word mountains, far from the countries{' '}
        </h4>

        <p>
            Copy: Far far away, behind the word mountains, far from the
            countries Vokalia and Consonantia, there live the blind texts.
            Separated they live in Bookmarksgrove right at the coast of the
            Semantics, a large language ocean.
        </p>
        <p className="text-secondary">
            Copy.secondary: Far far away, behind the word mountains, far from
            the countries Vokalia and Consonantia, there live the blind texts.
            Separated they live in Bookmarksgrove right at the coast of the
            Semantics, a large language ocean.
        </p>

        <p>
            <a href="">a: Just a normal link</a>
        </p>

        <p>
            <a href="" className="no-underline">
                a.no-underline
            </a>
        </p>

        <p>
            <a href="" className="no-underline icon-text">
                <SearchIcon style={{ width: 16, height: 16 }} />
                <span>no-underline icon-text</span>
            </a>
        </p>
    </div>
));

storiesOf('Layout/Base', module).add('Color', () => (
    <div>
        <style jsx>{`
            @import "vars";

            ul {
                display: flex;
                flex: 1 0 100px;
                flex-wrap: wrap;

                li {
                    list-style: none;
                    padding: 16px;
                }
            }

            .swatch {
                width: 100px;
                height: 100px;
                border: 1px solid black;
            }

            .swatch.white {
                background-color: $color-white;
            }
            .swatch.black {
                background-color: $color-black;
            }
            .swatch.grey14 {
                background-color: $color-grey14;
            }
            .swatch.grey20 {
                background-color: $color-grey20;
            }
            .swatch.grey47 {
                background-color: $color-grey47;
            }
            .swatch.grey60 {
                background-color: $color-grey60;
            }
            .swatch.grey79 {
                background-color: $color-grey79;
            }
            .swatch.grey90 {
                background-color: $color-grey90;
            }
            .swatch.grey96 {
                background-color: $color-grey96;
            }
            .swatch.navy {
                background-color: $color-navy;
            }
            .swatch.red {
                background-color: $color-red;
            }
            .swatch.footer-background {
                background-color: $color-footer-background;
            }
            .swatch.light-pink {
                background-color: $color-light-pink;
            }
        `}</style>

        <ul>
            <li>
                <div className="swatch white" />
                $color-white
            </li>
            <li>
                <div className="swatch black" />
                $color-black <br />
                $color-title
            </li>
            <li>
                <div className="swatch grey14" />
                $color-grey14
            </li>
            <li>
                <div className="swatch grey20" />
                $color-grey20 <br />
                $color-copy
            </li>
            <li>
                <div className="swatch grey47" />
                $color-grey47 <br/>
                $color-link
            </li>
            <li>
                <div className="swatch grey60" />
                $color-grey60
            </li>
            <li>
                <div className="swatch grey79" />
                $color-grey79 <br />
                $color-copy-secondary
            </li>
            <li>
                <div className="swatch grey90" />$color-grey90
            </li>
            <li>
                <div className="swatch grey96" />
                $color-grey96 <br />
                $background-image-color
            </li>
            <li>
                <div className="swatch navy" />$color-navy
            </li>
            <li>
                <div className="swatch red" />$color-red
            </li>
            <li>
                <div className="swatch footer-background" />$color-footer-background
            </li>
            <li>
                <div className="swatch light-pink" />$color-light-pink
            </li>
        </ul>
    </div>
));
