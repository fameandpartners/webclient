import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { SiteVersion } from '@common/constants';
import Button from '@components/base/Button/Button';
import Modal from '@components/modal/Modal';

storiesOf('Modal', module)
    .add('Basic Modal', () => (
        <Modal
            siteVersion={SiteVersion.US}
            headerNodes={<h1>I'm a header</h1>}
        >
            Hello I'm a Modal
        </Modal>
    ))
    .add('Basic Modal without header', () => (
        <Modal
            siteVersion={SiteVersion.US}
            showHeader={false}
        >
            Hello I don't have a header
        </Modal>
    ));