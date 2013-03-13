jQuery StyledForm
==================

StyledForm is intended to be a lightweight form transformation library that doesn't get in your way like other jQuery form libraries.

Currently, it supports the transformation of:

* `<select>` elements
* `<input type="radio"> elements
* `<input type="checkbox"` elements

# Installation #

If you have [Bower][1] installed (recommended approach), then you can install StyledForm using...

    bower install jquery-styledform

Alternatively, you can download the source from the latest [tag][2] for a stable codebase.

Examples are in the `/examples` directory.

# Using StyledForm #

Currently options are set statically (as is typical of a form style across a website, things don't usually change), but support for call-time options will be added in a future relase.

    $.styledForm.config = {
        checkboxHeight: 22,
        radioHeight: 22,
        selectArrowWidth: 30,
        styledClass: ''
    };

Options are as follows:

* `checkboxHeight` - The height of the image that represents a checkbox (defaults to 22px)
* `radioHeight` - The height of the image that represents a radio button (defaults to 22px)
* `selectArrowWidth` - The height of the image that represents a select box arrow (defaults to 30px)
* `styledClass` - If this is set, only elements that have the given class will be transformed by StyledForm. By default all form elements are styled.

To style a form, you simply run:

    $('form').styledForm();

# Customising StyledForm #

StyledForm makes use of image sprites for checkboxes, radio buttons and select boxes.

To use the default theme, you can use the sprites inside the `/examples/images` directory. To customise the theme of the form elements, simply override these with your own sprites.

# Issues #

If you have any issues with the library or have a feature request (its a pretty feature limited library right now) just open an issue [here][3].

[1]:  http://twitter.github.com/bower/
[2]:  https://github.com/jaitsu87/jQuery-StyledForm/tags
[3]:  https://github.com/jaitsu87/jQuery-StyledForm/issues