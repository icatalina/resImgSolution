var btf = btf || {};

btf.global = (function (d) {

    return {
        /*
         * @name    readContentBefore
         * @type    Function
         * @desc    Read the content from a before element
         * @author  Ignacio Catalina
        */
        readContentBefore: function (selector) {
            return !window.getComputedStyle ? false : window.getComputedStyle(document.querySelector(selector), ':before').content.replace(/\"/g, '');
        }
    };

}(document));

btf.responsive = (function (d) {

    /*
     * @name    imageRespond
     * @type    Function
     * @desc    Update the responsive images depending on page size if media query is different to responsive reference
     * @param   {Object} resImages - Collection of responsive images
     * @param   {String} orginalQuery - Previously active media query reference
     * @author  Ignacio Catalina
    */
    function imageRespond(resImages, orginalQuery) {
        var currentMediaQuery = btf.global.readContentBefore('body'),
            image, i, imgSrcFolder, imageMediaQuery, newSrc, imgSrc;

        currentMediaQuery = currentMediaQuery ? currentMediaQuery : 'desktop';

        // If nothing has changed
        if (currentMediaQuery === orginalQuery) { return orginalQuery; }
        
        // Loop over the responsive Images
        for (i = 0; i < resImages.length; ++i) {
            image = resImages[i];
            imgSrc = image.attributes.src.value;

            // Get image to replace
            imgSrcFolder = image.getAttribute('data-' + currentMediaQuery) || currentMediaQuery;

            // First Time, generates the origSrc
            if (!image.getAttribute('data-org-src')) {
                image.setAttribute('data-org-src', imgSrc);
            }
   

            imageMediaQuery = imgSrc.replace(/^.*\/responsive\/(.*?)\/.*$/, '$1');

            if (imageMediaQuery.indexOf('/') === -1 && imageMediaQuery !== currentMediaQuery) {
                image.src = imgSrc.replace(/\/responsive\/[\w\W]*?\//, '/responsive/' + imgSrcFolder + '/');
            }

        }
        return currentMediaQuery;
    }

    return {
        /*
         * @name    responsiveImages
         * @type    Function
         * @desc    Change images on page load and resize
         * @param   {String} selector - CSS selector for responsive images
         * @author  Ignacio Catalina
        */
        images: function (selector) {
            var resImages = d.querySelectorAll(selector),
                orginalQuery,
                timeout, i;

            function onLoadError() {
                this.src = this.getAttribute('data-org-src');
            }

            if (resImages.length) {
                for (i = 0; i < resImages.length; i++) {
                    resImages[i].onerror = onLoadError;
                }
                orginalQuery = imageRespond(resImages, orginalQuery);
            }

            window.onresize = function () {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function () {
                    orginalQuery = imageRespond(resImages, orginalQuery);
                }, 300);
            };

        }
    };
}(document));

document.addEventListener("DOMContentLoaded", function () {
    if (btf.responsive) {
        // Responsive images
        btf.responsive.images('.responsive');
    }
});