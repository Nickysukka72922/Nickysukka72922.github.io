// Copyright 2025 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
export function createOneGoogleBarApi(abp) {
    async function callApi(apiName, fnName, ...args) {
        const {gbar: gbar} = window;
        if (!gbar) {
            return
        }
        const api = await gbar.a[apiName]();
        return api[fnName].apply(api, args)
    }
    async function callAsyncBarApi(fnName, ...args) {
        const {gbar: gbar} = window;
        if (!gbar || !gbar.a) {
            queuedTask = {
                fnName: fnName,
                args: args
            };
            return Promise.resolve()
        }
        const barApi = await gbar.a["bf"]();
        return barApi[fnName].apply(barApi, args)
    }
    const api = [{
        name: "bar",
        apiName: "bf",
        fns: [["setForegroundStyle", "pc"], ["setBackgroundColor", "pd"], ["setDarkMode", "pp"]]
    }].reduce(( (topLevelApi, def) => {
        topLevelApi[def.name] = def.fns.reduce(( (apiPart, [name,fnName]) => {
            apiPart[name] = callApi.bind(null, def.apiName, fnName);
            return apiPart
        }
        ), {});
        return topLevelApi
    }
    ), {});
    const asyncBar = [["setDarkMode", "pp"]].reduce(( (bar, [name,fnName]) => {
        bar[name] = callAsyncBarApi.bind(null, fnName);
        return bar
    }
    ), {});
    async function updateDarkMode() {
        if (abp) {
            await asyncBar.setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
        } else {
            await api.bar.setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
            api.bar.setBackgroundColor("transparent");
            api.bar.setForegroundStyle(foregroundLight ? 1 : 0)
        }
    }
    let foregroundLight = false;
    let queuedTask = null;
    return {
        setForegroundLight: enabled => {
            if (abp) {
                asyncBar.setDarkMode(enabled)
            } else if (foregroundLight !== enabled) {
                foregroundLight = enabled;
                api.bar.setForegroundStyle(foregroundLight ? 1 : 0)
            }
        }
        ,
        trackDarkModeChanges: async () => {
            window.matchMedia("(prefers-color-scheme: dark)").addListener(( () => {
                updateDarkMode()
            }
            ));
            await updateDarkMode()
        }
        ,
        processTaskQueue: async () => {
            if (!queuedTask) {
                return
            }
            await callAsyncBarApi(queuedTask.fnName, ...queuedTask.args);
            queuedTask = null
        }
    }
}
