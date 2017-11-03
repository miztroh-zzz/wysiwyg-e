import { Element as PolymerElement } from '../../node_modules/@polymer/polymer/polymer-element.js';
import "../../node_modules/@polymer/paper-button/paper-button.js"
import "../../node_modules/@polymer/iron-icon/iron-icon.js"
import "../../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
import "../../node_modules/@polymer/neon-animation/web-animations.js"
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
import "../../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js"
import { WysiwygTool } from "../wysiwyg-tool.js"
import { WysiwygLocalize } from "../wysiwyg-localize.js"

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-blockquote');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
				</g>
			</defs>
		</svg>
	`;

	document.body.appendChild(iconset);
}

class WysiwygToolBlockquote extends WysiwygTool {
	static get template() {
		return `
			${super.template}
			<paper-button disabled="[[disabled]]" id="button">
				<iron-icon icon="wysiwyg-tool-blockquote:icon"></iron-icon>
			</paper-button>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Blockquote"></wysiwyg-localize>
				<span> (Shift + Alt + Q)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+q" on-keys-pressed="execCommand"></iron-a11y-keys>
		`;
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Blockquote': 'Citação'
			},
			'en': {
				'Blockquote': 'Blockquote'
			},
			'fr': {
				'Blockquote': 'Citation'
			}
		};

		this.allowedTagNames = ['blockquote'];
	}

	execCommand(clickTarget) {
		if (this.disabled || !this.range0) return;

		if (!this.active) {
			var rangeText = this.range0.toString();
			var blockquote = document.createElement('blockquote');
			blockquote.setAttribute('blockquote', '');
			this.range0.surroundContents(blockquote);
			if (!rangeText) blockquote.innerHTML = '<br>';
		} else  {
			var path = this.commonAncestorPath;

			if (path) {
				for (var i = 0; i < path.length - 1; i += 1) {
					if (path[i].tagName === 'BLOCKQUOTE' && path[i].hasAttribute('blockquote')) {
						path[i].outerHTML = path[i].innerHTML;
					}
				}
			}
		}
	}

	queryCommandEnabled() {
		return this.range0;
	}

	queryCommandState() {
		var path = this.commonAncestorPath;

		if (path) {
			for (var i = 0; i < path.length; i += 1) {
				if (path[i].tagName === 'BLOCKQUOTE' && path[i].hasAttribute('blockquote')) return true;
			}
		}

		return false;
	}
}

customElements.define('wysiwyg-tool-blockquote', WysiwygToolBlockquote);