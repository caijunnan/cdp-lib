﻿/* tslint:disable:no-unused-variable no-unused-vars */
/* eslint-disable no-unused-vars */

import { IBaseStructureConfigration,  GeneratorBase } from "../base";
import { IMobileAppConfigration } from "./interfaces";

/**
 * @class GeneratorCordova
 * @brief Mobile Cordova 用 Generator クラス
 */
export class GeneratorCordova extends GeneratorBase {

    ///////////////////////////////////////////////////////////////////////
    // imprementes: GeneratorBase

    /**
     * 既定の directory 構造を返却
     */
    defaultBaseStructure(): IBaseStructureConfigration {
        return {
            src: "app",
            pkg: "www",
            built: "app",
            doc: "docs",
            task: "tasks",
            test: "tests",
            types: "@types",
        };
    }

    /**
     * create action entry
     * @param {ILibraryConfigration} config コンフィグ設定
     */
    async create(config: IMobileAppConfigration): Promise<void> {
        // TODO:
        return Promise.reject("under construction.");
    }
}
