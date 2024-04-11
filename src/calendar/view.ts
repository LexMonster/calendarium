import {
    ItemView,
    type ViewStateResult,
    WorkspaceLeaf,
    addIcon,
    type ViewState,
    Notice,
} from "obsidian";
import type Calendarium from "src/main";
import CalendarUI from "./ui/UI.svelte";
import {
    type CalendarStore,
    type CalendarStoreState,
} from "src/stores/calendar.store";
import { nanoid } from "src/utils/functions";
import { ViewType, type ViewParent } from "./view.types";

addIcon(
    ViewType.Calendarium,
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14" role="img" viewBox="0 0 448 512"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"/><path fill="currentColor" d="M18.32 255.78L192 223.96l-91.28 68.69c-10.08 10.08-2.94 27.31 11.31 27.31h222.7c-9.44-26.4-14.73-54.47-14.73-83.38v-42.27l-119.73-87.6c-23.82-15.88-55.29-14.01-77.06 4.59L5.81 227.64c-12.38 10.33-3.45 30.42 12.51 28.14zm556.87 34.1l-100.66-50.31A47.992 47.992 0 0 1 448 196.65v-36.69h64l28.09 22.63c6 6 14.14 9.37 22.63 9.37h30.97a32 32 0 0 0 28.62-17.69l14.31-28.62a32.005 32.005 0 0 0-3.02-33.51l-74.53-99.38C553.02 4.7 543.54 0 533.47 0H296.02c-7.13 0-10.7 8.57-5.66 13.61L352 63.96 292.42 88.8c-5.9 2.95-5.9 11.36 0 14.31L352 127.96v108.62c0 72.08 36.03 139.39 96 179.38-195.59 6.81-344.56 41.01-434.1 60.91C5.78 478.67 0 485.88 0 494.2 0 504 7.95 512 17.76 512h499.08c63.29.01 119.61-47.56 122.99-110.76 2.52-47.28-22.73-90.4-64.64-111.36zM489.18 66.25l45.65 11.41c-2.75 10.91-12.47 18.89-24.13 18.26-12.96-.71-25.85-12.53-21.52-29.67z" style="&#10;    transform: scale(0.4125) translate(50%, 95%);&#10;"/></svg>`
);
addIcon(
    ViewType.Agenda,
    `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="calendar" class="svg-inline--fa fa-calendar fa-w-14" role="img" viewBox="0 0 448 512"><path xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M400 64h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V160h352v298c0 3.3-2.7 6-6 6z"/><path fill="currentColor" d="M18.32 255.78L192 223.96l-91.28 68.69c-10.08 10.08-2.94 27.31 11.31 27.31h222.7c-9.44-26.4-14.73-54.47-14.73-83.38v-42.27l-119.73-87.6c-23.82-15.88-55.29-14.01-77.06 4.59L5.81 227.64c-12.38 10.33-3.45 30.42 12.51 28.14zm556.87 34.1l-100.66-50.31A47.992 47.992 0 0 1 448 196.65v-36.69h64l28.09 22.63c6 6 14.14 9.37 22.63 9.37h30.97a32 32 0 0 0 28.62-17.69l14.31-28.62a32.005 32.005 0 0 0-3.02-33.51l-74.53-99.38C553.02 4.7 543.54 0 533.47 0H296.02c-7.13 0-10.7 8.57-5.66 13.61L352 63.96 292.42 88.8c-5.9 2.95-5.9 11.36 0 14.31L352 127.96v108.62c0 72.08 36.03 139.39 96 179.38-195.59 6.81-344.56 41.01-434.1 60.91C5.78 478.67 0 485.88 0 494.2 0 504 7.95 512 17.76 512h499.08c63.29.01 119.61-47.56 122.99-110.76 2.52-47.28-22.73-90.4-64.64-111.36zM489.18 66.25l45.65 11.41c-2.75 10.91-12.47 18.89-24.13 18.26-12.96-.71-25.85-12.53-21.52-29.67z" style="&#10;    transform: scale(0.4125) translate(50%, 95%);&#10;"/></svg>`
);

export default class CalendariumView extends ItemView implements ViewParent {
    ui: CalendarUI;
    constructor(public leaf: WorkspaceLeaf, public plugin: Calendarium) {
        super(leaf);
    }
    get full() {
        const rootSplit = this.app.workspace.rootSplit;
        return this.leaf.getRoot() === rootSplit;
    }
    calendar: string;
    store: CalendarStore | null;
    id: string = nanoid(12);
    child: string;
    async display() {
        if (!this.calendar) {
            this.calendar = this.plugin.defaultCalendar?.id;
        }
        this.store = this.plugin.getStore(this.calendar);

        if (!this.store) {
        }

        this.ui = new CalendarUI({
            target: this.contentEl,
            props: {
                view: this,
                plugin: this.plugin,
                store: this.store,
                full: this.full,
            },
        });
        this.plugin.registerEvent(
            this.app.workspace.on("layout-change", () =>
                this.ui.$set({ full: this.full })
            )
        );
        this.plugin.registerEvent(
            this.app.workspace.on("calendarium-updated", () => {
                if (!this.plugin.hasCalendar(this.calendar)) {
                    this.calendar = this.plugin.defaultCalendar?.id;
                }
                this.store = this.plugin.getStore(this.calendar);
                this.ui.$set({ store: this.store });
            })
        );
    }
    switchCalendar(calendar: string): void {
        const newStore = this.plugin.getStore(calendar);
        if (!newStore) {
            new Notice("There was an issue opening that calendar.");
            throw new Error("Could not find a calendar by that name");
        }
        this.store = newStore;
        this.calendar = calendar;

        this.ui.$set({ store: this.store });

        this.plugin.app.workspace.requestSaveLayout();
        this.plugin.app.workspace.trigger(
            "calendarium:view-parent:change-calendar",
            { parent: this.id, calendar }
        );
    }
    async setState(
        state: CalendarStoreState,
        result: ViewStateResult
    ): Promise<void> {
        if (state && Object.keys(state).length) {
            this.store = this.plugin.getStore(state.calendar);
            this.calendar = state.calendar;
            this.id = state.id;
            if (this.store) {
                this.store
                    .getEphemeralStore(this.id)
                    .initializeFromState(state.ephemeral);
            }
        }
        if (!this.ui) {
            this.plugin.onSettingsLoaded(() => this.display());
        }
        if (!this.id) {
            this.id = nanoid(12);
        }
        super.setState(state, result);
    }
    getState(): CalendarStoreState | undefined {
        const state = this.store?.getStoreState(this.id);
        if (!state) return undefined;
        const viewState: CalendarStoreState = { ...state, id: this.id };
        if (this.child) {
            viewState.child = this.child;
        }
        return viewState;
    }

    getViewType() {
        return ViewType.Calendarium;
    }
    getDisplayText() {
        return "Calendarium";
    }
    getIcon() {
        return ViewType.Calendarium;
    }
}
