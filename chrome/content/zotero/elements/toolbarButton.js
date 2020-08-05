/*
    ***** BEGIN LICENSE BLOCK *****
    
    Copyright © 2020 Corporation for Digital Scholarship
                     Vienna, Virginia, USA
                     https://www.zotero.org
    
    This file is part of Zotero.
    
    Zotero is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    Zotero is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.
    
    You should have received a copy of the GNU Affero General Public License
    along with Zotero.  If not, see <http://www.gnu.org/licenses/>.
    
    ***** END LICENSE BLOCK *****
*/

"use strict";

class ToolbarButton extends UIElement {
	constructor() {
		super();
	}
	
	connectedCallback() {
		var style = document.createElement('style');
		
		style.textContent = `
			/*:host {
				padding-left: 5px;
				padding-right: 5px;
				margin-right: 2px;
				margin-left: 2px;
			}
			
			:host([type="menu"]) {
				padding-left: 3px;
				padding-right: 3px;
				margin-left: 4px;
				margin-right: 2px;
			}*/
			
			:host(:first-child) {
				margin-left: 0 !important;
			}
			
			:host(:last-child) {
				margin-right: 0 !important;
			}
			
			:host(:hover:active) {
				mix-blend-mode: multiply;
			}
			
			div {
				display: inline-block;
			}
			
			#image {
				width: 16px;
				height: 16px;
				background-image: var(--image);
				background-size: var(--image-size, 16px);
			}
			
			#dropmarker-container {
				width: 7px;
				height: 16px;
				vertical-align: top;
				margin-left: 4px;
				margin-right: -6px;
			}
		`;
		
		if (Zotero.isMac) {
			style.textContent += `
				#container {
					-moz-margin-start: 0 !important;
					-moz-margin-end: 3px !important;
					-moz-padding-end: 10px !important;
					
					background: url("chrome://zotero/skin/mac/menubutton-end${Zotero.hiDPISuffix}.png") right center/auto 24px no-repeat;
				}
				
				#inner {
					background: url("chrome://zotero/skin/mac/menubutton-start${Zotero.hiDPISuffix}.png") left center/auto 24px no-repeat;
					padding: 4px 4px 4px 11px;
				}
				
				#image::-moz-window-inactive {
					background: url("chrome://zotero/skin/mac/menubutton-start-inactive-window${Zotero.hiDPISuffix}.png") left center/auto 24px no-repeat;
				}
				
				:host([open="true"]) #inner,
				:host(:not([disabled="true"]):hover:active) #inner {
					background: url("chrome://zotero/skin/mac/menubutton-start-pressed${Zotero.hiDPISuffix}.png") left center/auto 24px no-repeat;
				}
				
				:host([open="true"]) #container,
				:host(:not([disabled="true"]):hover:active) #container {
					background: url("chrome://zotero/skin/mac/menubutton-end-pressed${Zotero.hiDPISuffix}.png") right center/auto 24px no-repeat;
				}
				
				/* Use a darker background when inactive so the button itself doesn't get too dark at 50% */
				#container:-moz-window-inactive,
				#container:-moz-window-inactive:first-child,
				#container:-moz-window-inactive:last-child {
					background: url("chrome://zotero/skin/mac/menubutton-end-inactive-window${Zotero.hiDPISuffix}.png") right center/auto 24px no-repeat;
				}
				
				:host(-moz-window-inactive) {
					opacity: 0.5;
				}
			`;
		}
		
		var container = document.createElement('div');
		container.id = 'container';
		
		var inner = document.createElement('div');
		inner.id = 'inner';
		
		var image = document.createElement('div');
		image.id = 'image';
		
		inner.appendChild(image);
		container.appendChild(inner);
		container.appendChild(document.createElement('slot'));
		
		this.shadow.appendChild(style);
		this.shadow.appendChild(container);
		
		if (this.getAttribute('command')) {
			let cmd = document.getElementById(this.getAttribute('command'));
			if (cmd) {
				this.onclick = function (event) {
					event.stopPropagation();
					event.preventDefault();
					new Function(cmd.getAttribute('oncommand'))();
				};
			}
		}
		
		
		let type = this.getAttribute('type');
		if (type && type == 'menu') {
			let dropmarkerContainer = document.createElement('div');
			dropmarkerContainer.id = 'dropmarker-container';
			inner.appendChild(dropmarkerContainer);
			
			let dropmarker = document.createElement('img');
			dropmarker.src = `chrome://zotero/skin/searchbar-dropmarker${Zotero.hiDPISuffix}.png`;
			dropmarker.width = 7;
			dropmarker.height = 4;
			dropmarkerContainer.appendChild(dropmarker);
			
			this.onmousedown = (event) => {
				event.stopPropagation();
				event.preventDefault();
				
				let host = this.shadowRoot.host;
				let menupopup = host.getElementsByTagName('menupopup')[0];
				if (!menupopup) {
					Components.utils.reportError("Child <menupopup> not found");
					return;
				}
				menupopup.openPopup(host, 'after_start');
			};
		}
	}
}
customElements.define("toolbar-button", ToolbarButton);
