var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;
var updateParsedComponent = require('../EN/ENWeekdayParser').updateParsedComponent;

var util = require('../../utils/ZH-Hans.js');

var PATTERN = new RegExp(
    '(上|下|这)?' +
    '(?:个)?' +
    '(?:星期|礼拜|周)' +
    '(' + Object.keys(util.WEEKDAY_OFFSET).join('|') + ')'
);

var PREFIX_GROUP = 1;
var WEEKDAY_GROUP = 2;

exports.Parser = function ZHHansWeekdayParser() {

    Parser.apply(this, arguments);

    this.pattern = function () {
        return PATTERN;
    };

    this.extract = function (text, ref, match, opt) {
        var index = match.index;
        text = match[0];
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref
        });

        var dayOfWeek = match[WEEKDAY_GROUP];
        var offset = util.WEEKDAY_OFFSET[dayOfWeek];
        if (offset === undefined) return null;

        var modifier = null;
        var prefix = match[PREFIX_GROUP];

        if (prefix == '上') {
            modifier = 'last';
        } else if (prefix == '下') {
            modifier = 'next';
        } else if (prefix == '这') {
            modifier = 'this';
        }

        updateParsedComponent(result, ref, offset, modifier);
        result.tags['ZHHansWeekdayParser'] = true;
        return result;
    };
};