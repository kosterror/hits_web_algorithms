import { activeMode } from "./main.js";

const COLOR_ACTIVE = '#7AB0DC';
const COLOR_INACTIVE ='#247ABF';

function buttonsRenderEvent(e) {
    if (e.type == 'mouseover') {
            document.getElementById(e.target.id).style.backgroundColor = COLOR_ACTIVE;
    }

    if (e.type == 'mouseout') {
        if (e.target.id == 'add_vertex' && activeMode.value != 1) {
            document.getElementById(e.target.id).style.backgroundColor = COLOR_INACTIVE;
        }

        if (e.target.id == 'remove_vertex' && activeMode.value != 2) {
            document.getElementById(e.target.id).style.backgroundColor = COLOR_INACTIVE;
        }

        if (e.target.id == 'launch_algorithm' && activeMode.value != 3) {
            document.getElementById(e.target.id).style.backgroundColor = COLOR_INACTIVE;
        }

        if (e.target.id == 'reload') {
            document.getElementById(e.target.id).style.backgroundColor = COLOR_INACTIVE;
        }
    }
}

function buttonsRender() {
    if (activeMode.value == 0) {
        document.getElementById('add_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('remove_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('launch_algorithm').style.backgroundColor = COLOR_INACTIVE;
    }

    else if (activeMode.value == 1) {
        document.getElementById('add_vertex').style.backgroundColor = COLOR_ACTIVE;
        document.getElementById('remove_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('launch_algorithm').style.backgroundColor = COLOR_INACTIVE;
    }

    else if (activeMode.value == 2) {
        document.getElementById('add_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('remove_vertex').style.backgroundColor = COLOR_ACTIVE;
        document.getElementById('launch_algorithm').style.backgroundColor = COLOR_INACTIVE;
    }

    else if (activeMode.value == 3) {
        document.getElementById('add_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('remove_vertex').style.backgroundColor = COLOR_INACTIVE;
        document.getElementById('launch_algorithm').style.backgroundColor = COLOR_ACTIVE;
    }
}

export { buttonsRenderEvent, buttonsRender };