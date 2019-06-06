var smartgrid = require('smart-grid');

/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    // offset: '60px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1820px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        xxl: {
          width: '1700px'
        },
        xl: {
          width: '1555px',
        },
        lg: {
            width: '1200px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '992px'
        },
        sm: {
            width: '768px',
        },
        xs: {
            width: '576px'
        }
    }
};

smartgrid('./app/sass/', settings);