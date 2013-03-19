/**
 * jQuery Styled Form plugin
 *
 * Inspired by styledinput.js by Ryan Fait (http://ryanfait.com)
 *
 * @author  James Halsall <james.t.halsall@googlemail.com>
 * @link    http://www.github.com/jaitsu87/jQuery-StyledForm
 * @license GPL (http://www.gnu.org/licenses/gpl-3.0.html)
 * @version 1.1.0
 */
(function($) {

    $.fn.styledForm = function() {

        var $sf = $.styledForm, config = $sf.config, $container = $(this), inputQuery = '', selectQuery;
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

            if ($(input).prop('checked')) {
                var height;
                if ($(input).attr('type') == 'checkbox') {
                    height = config.checkboxHeight;
                } else {
                    height = config.radioHeight;
                }
                $span.css('background-position', '0 -' + (height * 2) + 'px');
            }

            if ($(input).attr('type') == 'radio') {
                $span.attr('data-field-name', $(input).attr('name'));
            }

            $(input).before($span);

            if ($(input).attr('disabled')) {
                $span.addClass('disabled');
            }

            $(input).css('display', 'none');
            $sf.addElement($span);
        });

        var $selects = $container.find(selectQuery);
        $.each($selects, function(i, select) {
            var $option = $(select).find('option:selected');

            var attributeName = $sf._canonicalize($(select).attr('name'));
            var $span = $('<span>', {
                "class": "select",
                "id": "styled-select-" + attributeName
            });

            var selectWidth = $(select).width() + config.selectArrowWidth;
            $span.append($option.text());
            $span.css('width', selectWidth);

            var $arrowSpan = $('<span>', {
                "class": "select-arrow"
            });
            $span.append($arrowSpan);
            $(select).before($span);
            $(select).css('width', selectWidth);
            var $p = $(select).parent();
            if (!$p.is('form')) {
                $p.css('width', selectWidth);
            }

            if ($(select).attr('disabled')) {
                $(select).prev().addClass('disabled');
            }

            $sf.addElement($span);
        });

        // we bind events on the container, and let them bubble
        $container.on('change', $sf.change);
        $container.on('mousedown', $sf.beforeClick);
        $container.on('mouseup', $sf.afterClick);
        if (config.pollFrequency !== false) {
            setInterval($sf.poll, config.pollFrequency);
        }
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
            styledClass: '',
            pollFrequency: 1000
        },

        /**
         * Collection of all styled elements on the page as jQuery objects
         *
         * @type {Array}
         */
        _elements: [],

        /**
         * Adds an element to the elements array
         */
        addElement : function($el) {
            if (!$el instanceof jQuery) {
                $el = $($el);
            }
            this._elements.push($el);
        },

        /**
         * Polls for element changes.
         *
         * Checks to see if any styled elements have mutated and updates their styledForm
         * counterparts accordingly.
         */
        poll : function() {
            var s = $.styledForm;
            $.each(s._elements, function(i, el) {
                var $el = $(el), $input;
                if ($el.hasClass('select')) {
                    $input = $el.next('select');
                } else {
                    $input = $el.next('input');
                }

                if ($input.attr('disabled') && !$el.hasClass('disabled')) {
                    $el.addClass('disabled');
                } else if (!$input.attr('disabled') && $el.hasClass('disabled')) {
                    $el.removeClass('disabled');
                }
            });
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

            // user has clicked on the label
            if ($target.attr('for')) {
                $element = $('#' + $target.attr('for'));
                $target = $element.prev('span');
            }

            var type = $target.attr('class');

            if ($element.attr('disabled') || !$.styledForm._isStyledElement($element)) {
                return;
            }

            if ($.inArray(type, ['checkbox', 'radio']) !== -1) {
                var backgroundString = '0 -';
                var heightVar = (type == 'checkbox') ? config.checkboxHeight : config.radioHeight;
                var height = heightVar;

                if ($target.prop('checked')) {
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
            if (e.which && e.which == 3) {
                return; //ignore right click
            }
            var config = $.styledForm.config;
            var $target = $(e.target);
            var $element = $target.next('input');

            // user has clicked on the label
            if ($target.attr('for')) {
                $element = $('#' + $target.attr('for'));
                $target = $element.prev('span');
            }

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
                $element.prop('checked', true);
            } else if (type == 'checkbox') {
                if ($element.prop('checked')) {
                    $target.css('background-position', '0 0');
                    $element.removeAttr('checked');
                } else {
                    $target.css('background-position', '0 -' + (config.checkboxHeight * 2) + 'px');
                    $element.prop('checked', true);
                }
            }
        },

        /**
         * Handles a change event fired inside a container
         *
         * @param {Object} e The change event object
         */
        change : function(e) {
            var config = $.styledForm.config;
            var $element = $(e.target);
            var type = $element.attr('type');

            if (!$.styledForm._isStyledElement($element)) {
                return;
            }

            var attributeName = $.styledForm._canonicalize($element.attr('name'));

            if (type == 'checkbox') {
                var $target = $element.parent().find('.checkbox');
                if ($element.prop('checked')) {
                    $target.css('background-position', '0 -' + (config.checkboxHeight * 2) + 'px');
                    $element.removeAttr('checked');
                } else {
                    $target.css('background-position', '0 0');
                    $element.prop('checked', true);
                }
            } else if (type != 'radio') {
                var $selectedOption = $element.find('option:selected');
                $(this).find('#styled-select-' + attributeName).html($selectedOption.text() + '<span class="select-arrow"></span>');
            }
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