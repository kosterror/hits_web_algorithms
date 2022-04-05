import { activeMode } from "./main.js";

function buttonsRenderEvent(e) {
    if (e.type == 'mouseover') {
        document.getElementById(e.target.id).style.backgroundColor = '#666969';
    }

    if (e.type == 'mouseout') {
        if (e.target.id == 'add_vertex' && activeMode.value != 1) {
            document.getElementById(e.target.id).style.backgroundColor = '#8D9091';
        }

        if (e.target.id == 'remove_vertex' && activeMode.value != 2) {
            document.getElementById(e.target.id).style.backgroundColor = '#8D9091';
        }

        if (e.target.id == 'launch_algorithm' && activeMode.value != 3) {
            document.getElementById(e.target.id).style.backgroundColor = '#8D9091';
        }

        if (e.target.id == 'reload') {
            document.getElementById(e.target.id).style.backgroundColor = '#8D9091';
        }
    }
}

function buttonsRender() {
    if (activeMode.value == 0) {
        document.getElementById('add_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('remove_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('launch_algorithm').style.backgroundColor = '#8D9091';
    }

    else if (activeMode.value == 1) {
        document.getElementById('add_vertex').style.backgroundColor = '#666969';
        document.getElementById('remove_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('launch_algorithm').style.backgroundColor = '#8D9091';
    }

    else if (activeMode.value == 2) {
        document.getElementById('add_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('remove_vertex').style.backgroundColor = '#666969';
        document.getElementById('launch_algorithm').style.backgroundColor = '#8D9091';
    }

    else if (activeMode.value == 3) {
        document.getElementById('add_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('remove_vertex').style.backgroundColor = '#8D9091';
        document.getElementById('launch_algorithm').style.backgroundColor = '#666969';
    }
}

export { buttonsRenderEvent, buttonsRender };