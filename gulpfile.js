'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Modal-scrollableContent' is not camelCase and will not be type-safe.`);
build.addSuppression(`Warning - [sass] src/core/components/PromoForm/PromoForm.overrides.scss: filename should end with module.sass or module.scss`);

build.initialize(require('gulp'));