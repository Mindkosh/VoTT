import createMockStore, { MockStoreEnhanced } from "redux-mock-store";
import thunk from "redux-thunk";
import * as applicationActions from "./applicationActions";
import { ActionTypes } from "./actionTypes";
import { IpcRendererProxy } from "../../common/ipcRendererProxy";
import { IAppSettings } from "../../models/applicationState";
import { IApplicationState } from "../../models/applicationState";
import MockFactory from "../../common/mockFactory";
import initialState from "../store/initialState";

describe("Application Redux Actions", () => {
    let store: MockStoreEnhanced<IApplicationState>;
    const appSettings = MockFactory.appSettings();

    beforeEach(() => {
        IpcRendererProxy.send = jest.fn(() => Promise.resolve());
        const middleware = [thunk];
        const mockState: IApplicationState = {
            ...initialState,
            appSettings,
        };
        store = createMockStore<IApplicationState>(middleware)(mockState);
    });

    it("Toggle Dev Tools action forwards call to IpcRenderer proxy and dispatches redux action", async () => {
        const payload = true;
        await applicationActions.toggleDevTools(payload)(store.dispatch);
        const actions = store.getActions();

        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual({
            type: ActionTypes.TOGGLE_DEV_TOOLS_SUCCESS,
            payload,
        });

        expect(IpcRendererProxy.send).toBeCalledWith("TOGGLE_DEV_TOOLS", payload);
    });

    it("Reload application action forwards call to IpcRenderer proxy and dispatches redux action", async () => {
        await applicationActions.reloadApplication()(store.dispatch);
        const actions = store.getActions();

        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual({
            type: ActionTypes.REFRESH_APP_SUCCESS,
        });

        expect(IpcRendererProxy.send).toBeCalledWith("RELOAD_APP");
    });

    it("Save app settings action saves state", async () => {
        const appSettings: IAppSettings = {
            devToolsEnabled: false,
        };

        const result = await applicationActions.saveAppSettings(appSettings)(store.dispatch);
        const actions = store.getActions();

        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual({
            type: ActionTypes.SAVE_APP_SETTINGS_SUCCESS,
            payload: appSettings,
        });

        expect(result).toEqual(appSettings);
    });

    it("Ensure security token action creates a token if one doesn't exist", async () => {
        const appSettings: IAppSettings = {
            devToolsEnabled: false,
        };
        const middleware = [thunk];
        const mockState: IApplicationState = {
            ...initialState,
            appSettings,
        };

        store = createMockStore<IApplicationState>(middleware)(mockState);

        const testProject = MockFactory.createTestProject("TestProject");
    });
});
