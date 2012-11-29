/**
 * jQuery Styled Form plugin
 *
 * Inspired by styledinput.js by Ryan Fait (http://ryanfait.com)
 *
 * Project Page: http://www.github.com/jaitsu87/jQuery-StyledForm
 * Licensed Under the GPL License (http://www.gnu.org/licenses/gpl-3.0.html)
 * Version 0.8 (2012)
 */
(function($) {

    $.fn.styledForm = function() {

        var config = $.styledForm.config, $container = $(this), inputQuery = '', selectQuery;
        if (config.styledClass) {
            inputQuery = 'input.' + config.styledClass + '[type="checkbox"], input.' + config.styledClass + '[type="radio"]';
            selectQuery = 'select.' + config.styledClass;
        } else {
            inputQuery = 'input[type="checkbox"], input[type="radio"]';
            selectQuery = 'select';
        }

        var $inputs = $container.find(inputQuery);
        $.each($inputs, function(i, input) {
            var $span = $('<span>').addClass($(input).attr('type'));

            if ($(input).attr('checked')) {
                var height;
                if ($(input).attr('type') == 'checkbox') {
                    height = config.checkboxHeight;
                } else {
                    height = config.radioHeight;
                }
                $span.css('background-position', '0 -' + (height * 2) + 'px');
            }
            $(input).before($span);

            if ($(input).attr('disabled')) {
                $span.addClass('disabled');
            }

            $(input).css('display', 'none');
        });

        var $selects = $container.find(selectQuery);
        $.each($selects, function(i, select) {
            var $option = $(select).find('option:selected');

            var attributeName = $.styledForm._canonicalize($(select).attr('name'));
            var $span = $('<span>', {
                class: 'select',
                id: 'styled-select-' + attributeName
            });

            var selectWidth = $(select).width() + config.selectArrowWidth;
            $span.append($option.text());
            $span.css('width', selectWidth);

            var $arrowSpan = $('<span>', {
                class: 'select-arrow'
            });
            $span.append($arrowSpan);
            $(select).before($span);
            $(select).css('width', selectWidth);
            $(select).parent().css('width', selectWidth);

            if ($(select).attr('disabled')) {
                $(select).prev().addClass('disabled');
            }
        });

        // we bind events on the container, and let them bubble
        $container.on('change', $.styledForm.change);
        $container.on('mousedown', $.styledForm.beforeClick);
        $container.on('mouseup', $.styledForm.afterClick);
    };

    /**
     * Styled Form helpers and configuration object
     *
     * @type {Object}
     */
    $.styledForm = {

        /**
         * The configuration object for styledForm
         *
         * @type {Object}
         */
        config: {
            checkboxHeight: 22,
            radioHeight: 22,
            selectArrowWidth: 30,
            styledClass: ''
        },

        /**
         * Handles the before click event fired inside a container
         *
         * @param {Object} e The click event object
         */
        beforeClick : function(e) {
            if (e.which && e.which == 3) {
                return; //ignore right click
            }
            var config = $.styledForm.config;
            var $target = $(e.target);
            var $element = $target.next();
            var type = $target.attr('class');

            if ($element.attr('disabled') || !$.styledForm._isStyledElement($element)) {
                return;
            }

            if ($.inArray(type, ['checkbox', 'radio']) !== -1) {
                var backgroundString = '0 -';
                var heightVar = (type == 'checkbox') ? config.checkboxHeight : config.radioHeight;
                var height = heightVar;

                if ($target.attr('checked')) {
                    height = heightVar * 3;
                }
                backgroundString += height + 'px';

                $target.css('background-position', backgroundString);
            }
        },

        /**
         * Handles the after click event
         *
         * @param e {Object} The click event object
         */
        afterClick : function(e) {
            var config = $.styledForm.config;
            var $target = $(e.target);
            var $element = $target.next('input');
            var type = $element.attr('type');

            if ($element.attr('disabled') || !$.styledForm._isStyledElement($element)) {
                return;
            }

            // for radio buttons, we need to un-check all other radios with the same name in this container
            if (type == 'radio') {
                var $radios = $(this).find('input[type="radio"][name="' + $element.attr('name') + '"]');
                $.each($radios, function(i, radio) {
                    if (radio != $element.get().nextSibling && $(radio).prev()) {
                        $(radio).prev().css('background-position', '0 0');
                        $(radio).removeAttr('checked');
                    }
                });
                $target.css('background-position', '0 -' + (config.radioHeight * 2) + 'px');
                $element.attr('checked', 'checked');
            } else if (type == 'checkbox') {
                if ($element.attr('checked')) {
                    $target.css('background-position', '0 0');
                    $element.removeAttr('checked');
                } else {
                    $target.css('background-position', '0 -' + (config.checkboxHeight * 2) + 'px');
                    $element.attr('checked', 'checked');
                }
            }
        },

        /**
         * Handles a change event fired inside a container
         *
         * @param {Object} e The change event object
         */
        change : function(e) {
            var $element = $(e.target);

            if (!$.styledForm._isStyledElement($element)) {
                return;
            }

            var $selectedOption = $element.find('option:selected');
            var attributeName = $.styledForm._canonicalize($element.attr('name'));
            $(this).find('#styled-select-' + attributeName).html($selectedOption.text() + '<span class="select-arrow"></span>');
        },

        /**
         * Returns true if the given jQuery object is a wrapper for a styled input element
         *
         * @param {jQuery} $element A jquery wrapper of an input or select element
         *
         * @private
         */
        _isStyledElement : function($element) {
            var styledClass = $.styledForm.config.styledClass;
            if (styledClass) {
                return $element.hasClass(styledClass);
            }

            return true;
        },

        /**
         * Canonicalizes a string ready for attribute use
         *
         * @param {String} string The string to canonicalize
         *
         * @private
         */
        _canonicalize : function(string) {
            return $.trim(string.replace('[', '').replace(']', '-'));
        }
    };

})(jQuery);