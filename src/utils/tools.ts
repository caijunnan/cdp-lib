﻿import {
    fs,
    hogan,
    $,
    which,
    uuid,
    chalk,
    Spinner,
} from "./libs";

import { spawn, SpawnOptions } from "child_process";

import * as os from "os";

///////////////////////////////////////////////////////////////////////
// exports methods:

/**
 * Get spinner instance.
 * CLI helper.
 *
 * @param  {String}  [format]  spinner format string.
 * @param  {Number}  [index]   spinner index defined by cli-spinner. (default: random [0-9])
 * @return {Spinner} cli-spinner instance.
 */
export function getSpinner(format?: string, index?: number): { start: () => void; stop: (clean?: boolean) => void; } {
    let fmt = format || "%s";
    let spinner = new Spinner(fmt);
    let idx = (null != index && 0 <= index && index < 10) ? index : Math.floor(Math.random() * 9); // random value of preset array[0-9]
    spinner.setSpinnerString(Spinner.spinners[idx]);
    return spinner;
}

//___________________________________________________________________________________________________________________//

/**
 * @interface NormalizeTextOptions
 * @brief normalizeText() に指定するオプション
 */
export interface NormalizeTextOptions {
    eol?: string;   // default: os.EOL
    bom?: boolean;  // default: true
    tab?: number;   // tab を変換するスペースの数を指定. default: 変換しない
}

/**
 * Normalize text line-feed.
 * for windows git user.
 *
 * @param  {String}               text    input text.
 * @param  {NormalizeTextOptions} [setBOM]  true: set BOM / false: remove BOM.
 * @return {String} normalized text.
 */
export function normalizeText(text: string, options?: NormalizeTextOptions): string {
    let opt: NormalizeTextOptions = $.extend({}, {
        eol: os.EOL,
        bom: true,
    }, options);

    text = text
        .replace(/^\ufeff/gm, "")   // remove bom
        .replace(/\r\n/gm, "\n")    // once '\n'
        .replace(/\r/gm, "\n")      // once '\n'
    ;

    if (opt.bom) {
        text = "\ufeff" + text;
    }
    if ("\n" !== opt.eol) {
        text = text.replace(/\n/gm, opt.eol);
    }
    if (opt.tab) {
        let spaces = (() => {
            let s = "";
            for (let i = 0; i < opt.tab; i++) {
                s += " ";
            }
            return s;
        })();
        text = text.replace(/\t/gm, spaces);
    }

    return text;
}

//___________________________________________________________________________________________________________________//

/**
 * @interface ExecCommandOptions
 * @brief execCommand() に指定するオプション
 */
export interface ExecCommandOptions extends SpawnOptions {
    spinner?: {
        format?: string;    // ex) "%s"
        index?: number;     // 0 - 9 の数値を指定
    };
}

/**
 * Execute command line by spawn.
 * call spawn. if error occured, cui is killed proccess.
 *
 * @param   {String}               command    main command. ex) "cordova"
 * @param   {String[]}             args       command args. ex) ["plugin", "add", pluginName]
 * @param   {ExecCommandOptions}   [options]  cli-spinner"s options.
 * @returns {Number} error code
 */
export function execCommand(command: string, args: string[], options?: ExecCommandOptions): JQueryPromise<number> {
    let df = $.Deferred();
    let opt: ExecCommandOptions = $.extend({}, {
        stdio: "inherit",
        spinner: { format: "%s" },
    }, options);

    which(command, (error, resolvedCommand) => {
        if (error) {
            handleError(JSON.stringify(error));
        }

        let spinner = opt.spinner ? getSpinner(opt.spinner.format, opt.spinner.index) : null;
        if (spinner) {
            spinner.start();
        }

        spawn(resolvedCommand, args, opt)
            .on("error", handleError)
            .on("close", (code) => {
                if (spinner) {
                    spinner.stop(true);
                }
                df.resolve(code);
            });
    });

    return df.promise();
}

//___________________________________________________________________________________________________________________//

/**
 * @interface CopyTemplateOptions
 * @brief copyTpl() に指定するオプション
 */
export interface CopyTemplateOptions extends NormalizeTextOptions {
    delimiters?: "{{ }}" | "<% %>"; // template に使用する delimiter. default: "{{ }}"
}

/**
 * Copy template with hogan.
 * sync function
 *
 * @param {String}               src       source file path.
 * @param {String}               dst       destination file path.
 * @param {Object}               params    template parameters.
 * @param {CopyTemplateOptions}  [options] options object.
 */
export function copyTpl(src: string, dst: string, params: Object, options?: CopyTemplateOptions): void {
    var opt = $.extend({}, {
        eol: os.EOL,
        bom: true,
        delimiters: "{{ }}",
    }, options);

    let jst = hogan.compile(normalizeText(fs.readFileSync(src).toString(), { eol: "\n", bom: false }), opt);
    let output = normalizeText(jst.render(params), opt);

    fs.copySync(dst, output, "utf8");
}

//___________________________________________________________________________________________________________________//

/**
 * GUID generate.
 * returned as Windows registry type format.
 *
 * @return {String}
 */
export function createGUID(): string {
    return "{" + uuid.v4().toUpperCase() + "}";
}

//___________________________________________________________________________________________________________________//

/**
 * Create XML DOM node.
 *
 * @param  {String} str  string xml format. ex) '<preference name="DisallowOverscroll" value="true"/>'
 * @return {jQuery} XML Node instance
 */
export function str2XmlNode(str: string): JQuery {
    return $($.parseXML(str)).children();
}

/**
 * @interface FormatXmlOptions
 * @brief formatXML() に指定するオプション
 */
export interface FormatXmlOptions extends NormalizeTextOptions {
    step?: number;   // 空白スペース数. default: 2
}

/**
 * XML formatter.
 *
 * @param  {String}           str       string xml format. ex) '<preference name="DisallowOverscroll" value="true"/>'
 * @param  {FormatXmlOptions} [options] options object.
 * @return {String} formatted XML
 */
export function formatXML(str: string, options?: FormatXmlOptions): string {
    let xml = "";
    let pad = 0;
    let opt: FormatXmlOptions = $.extend({}, {
        eol: os.EOL,
        bom: true,
        step: 2,
    }, options);
    let indent: number;
    let node: string;

    let strArr = normalizeText(str, { eol: "\n" })
        .replace(/(>)(<)(\/*)/g, "$1\n$2$3") // insert LF to each node once.
        .split("\n");

    let spaces = (len: number) => {
        let s = "";
        let indent = len * opt.step;
        for (let i = 0; i < indent; i++) {
            s += " ";
        }
        return s;
    };

    for (let i = 0; i < strArr.length; i++) {
        indent = 0;
        node = $.trim(strArr[i]);
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad > 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }
        xml += spaces(pad) + node + opt.eol;
        pad += indent;
    }

    xml = xml.replace(/\n\n/gm, "\n");

    return normalizeText(xml, opt);
}

///////////////////////////////////////////////////////////////////////
// private methods:

/**
 * Handle command line error and kill process.
 * When the application received error from cli, please call this method.
 *
 * @param {String} error  error information.
 */
function handleError(error: string): void {
    console.error(chalk.red(error));
    // returned exit code = 1 (fail)
    process.exit(1);
}
