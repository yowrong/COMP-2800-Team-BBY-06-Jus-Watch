
// https://dev.to/ms314006/use-jest-write-unit-testing-for-dom-manipulation-3n6c used as a resource

import { displayGroup } from 

test('Check Group Name able to change', () => {
    document.body.innerHTML = `<div class="title">
    <h2><span id="group-name"></span> Movie Center</h2>
    <p id="group-description"></p>
</div>`;

require('./group_centre.js');

const groupName = document.getElementById('group-name');


groupName.innerHTML = "My Group";

expect(groupName.innerHTML).toBe('My Group');
})

const groupDescription = document.getElementById('group-description');