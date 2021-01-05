(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VV = {}));
}(this, (function (exports) { 'use strict';

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	var EventEmitter = /*#__PURE__*/function () {
	  function EventEmitter() {
	    this.events_handlers = {};
	  }

	  var _proto = EventEmitter.prototype;

	  _proto.on = function on(type, callback) {
	    if (typeof callback === "function") {
	      var handlers = this.events_handlers[type] || (this.events_handlers[type] = {});
	      handlers[callback.name] = callback;
	    }
	  };

	  _proto.of = function of(type, callback) {
	    if (typeof callback === "function") {
	      this.events_handlers[type].remove(callback.name);
	    } else {
	      type.events_handlers.remove(type);
	    }
	  };

	  _proto.emitter = function emitter(type, data) {
	    var handlers = this.events_handlers[type];

	    for (var name in handlers) {
	      handlers[name].apply(this, {
	        target: this,
	        data: data
	      });
	    }
	  };

	  return EventEmitter;
	}();

	var CodeArea = /*#__PURE__*/function (_EventEmitter) {
	  _inheritsLoose(CodeArea, _EventEmitter);

	  function CodeArea(codeContent, codeToolbar) {
	    var _this;

	    _this = _EventEmitter.call(this) || this;
	    _this.contElement = codeContent;
	    _this.toolElement = codeToolbar;
	    _this.contElement.innerHTML = CodeArea.Html.codeContent;
	    _this.toolElement.innerHTML = CodeArea.Html.codeToolbar;
	    _this.codeContent = _this.contElement.querySelector(CodeArea.Selector.codeContent);
	    _this.codeToolbar = _this.toolElement.querySelector(CodeArea.Selector.codeToolbar);
	    return _this;
	  }

	  var _proto = CodeArea.prototype;

	  _proto.init = function init(config) {
	    var codeConfig = config && config.editor ? config.editor : CodeArea.internalEditor;
	    this.editor = codeConfig.initialize(this);
	  };

	  _proto.userEditor = function userEditor(initialize) {
	    this.editor = initialize();
	  };

	  _proto.setSize = function setSize(width, height) {
	    if (width) this.contElement.style.width = width;
	    if (height) this.contElement.style.height = height;
	    this.editor.setSize(width, height);
	  };

	  _proto.setValue = function setValue(value) {
	    this.editor.setValue(value);
	  };

	  _proto.getValue = function getValue() {
	    return this.editor.getValue();
	  };

	  return CodeArea;
	}(EventEmitter);

	CodeArea.Class = {
	  codeContent: "code-content",
	  codeToolbar: "code-toolbar"
	};
	CodeArea.Html = {
	  codeContent: "<textarea class=\"" + CodeArea.Class.codeContent + "\"></textarea>",
	  codeToolbar: "<div class=\"" + CodeArea.Class.codeToolbar + "\"></div>"
	};
	CodeArea.Selector = {
	  codeContent: "." + CodeArea.Class.codeContent,
	  codeToolbar: "." + CodeArea.Class.codeToolbar
	};
	CodeArea.internalEditor = {
	  initialize: function initialize(codeArea) {
	    codeArea.codeContent.addEventListener("input", function () {
	      codeArea.emitter("codechange");
	    });
	    return {
	      setValue: function setValue(value) {
	        codeArea.codeContent.value = value;
	        codeArea.emitter("codechange");
	      },
	      getValue: function getValue() {
	        return codeArea.codeContent.value;
	      },
	      setSize: function setSize(width, height) {
	        if (width) codeArea.contElement.style.width = width;
	        if (height) codeArea.contElement.style.height = height;
	      }
	    };
	  }
	};

	var ViewArea = /*#__PURE__*/function () {
	  function ViewArea(viewContent, viewToolbar) {
	    this.contElement = viewContent;
	    this.toolElement = viewToolbar;
	    this.contElement.innerHTML = ViewArea.Html.viewContent;
	    this.toolElement.innerHTML = ViewArea.Html.viewToolbar;
	    this.viewContent = document.querySelector(ViewArea.Selector.viewContent);
	    this.viewToolbar = document.querySelector(ViewArea.Selector.viewToolbar);
	    this.converter = ViewArea.internalConverter;
	    this.decorators = ViewArea.internalDecorators;
	  }

	  var _proto = ViewArea.prototype;

	  _proto.init = function init(config) {
	    this.initTools();
	    return this;
	  };

	  _proto.initTools = function initTools() {
	    var _this = this;

	    var selectViewStyle = document.querySelector(ViewArea.Selector.selectViewStyle);
	    selectViewStyle.addEventListener("change", function (e) {
	      _this.setStyle(e.target.value);
	    });
	    var optionsHtml = "";

	    for (var sty in ViewArea.Style) {
	      var option = "<option value=\"" + sty + "\">" + sty + "</option>";
	      optionsHtml += option;
	    }

	    selectViewStyle.innerHTML = optionsHtml;
	    this.setStyle("purple");
	  };

	  _proto.setConverter = function setConverter(converter) {
	    this.converter = converter;
	  };

	  _proto.setDecorator = function setDecorator(type, decorator) {
	    this.decorators[type + ""] = decorator;
	  };

	  _proto.setStyle = function setStyle(style) {
	    for (var sty in ViewArea.Style) {
	      this.viewContent.classList.remove(ViewArea.Style[sty]);
	    }

	    this.viewContent.classList.add(ViewArea.Style[style]);
	    var selectViewStyle = document.querySelector(ViewArea.Selector.selectViewStyle);
	    selectViewStyle.value = style;
	  };

	  _proto.setSize = function setSize(width, height) {
	    if (width) this.contElement.style.width = width;
	    if (height) this.contElement.style.height = height;
	    this.viewContent.style.overflow = "auto";
	  };

	  _proto.show = function show(v) {
	    this.viewContent.innerHTML = this.converter(v);

	    for (var type in this.decorators) {
	      var codes = this.viewContent.querySelectorAll("pre code[class*=\"language-" + type + "\"]");
	      var decorator = this.decorators[type];
	      decorator(this.viewContent, codes);
	    }
	  };

	  return ViewArea;
	}();

	ViewArea.Class = {
	  viewContent: "view-content",
	  viewToolbar: "view-toolbar",
	  selectViewStyle: "select-view-style"
	};
	ViewArea.Html = {
	  viewContent: "<div class=\"" + ViewArea.Class.viewContent + "\"></div>",
	  viewToolbar: "<div class=\"" + ViewArea.Class.viewToolbar + "\">\n                        <select class=\"" + ViewArea.Class.selectViewStyle + "\"></select>\n                      </div>"
	};
	ViewArea.Selector = {
	  viewContent: "." + ViewArea.Class.viewContent,
	  viewToolbar: "." + ViewArea.Class.viewToolbar,
	  selectViewStyle: "." + ViewArea.Class.selectViewStyle
	};
	ViewArea.Style = {
	  default: "view-html-default",
	  github: "view-html-github",
	  maize: "view-html-maize",
	  purple: "view-html-purple"
	};

	ViewArea.internalConverter = function (v) {
	  return v;
	};

	ViewArea.internalDecorators = {
	  toc: function toc(root, codes) {
	    var tocBox = document.createElement("div");
	    var tocHead = document.createElement("div");
	    tocHead.style.textAlign = "center";
	    tocHead.style.fontWeight = "bold";
	    tocHead.innerText = "目录";
	    tocBox.append(tocHead);
	    var tocBody = document.createElement("div");
	    tocBox.append(tocBody);
	    var hs = root.querySelectorAll("h1,h2,h3,h4,h5,h6");
	    hs.forEach(function (h, i) {
	      var id = "toc-" + i;
	      h.id = id;
	      var hLink = document.createElement("a");
	      hLink.href = "javascript:document.querySelector('#" + id + "').scrollIntoView(true);";
	      hLink.innerText = h.innerText;
	      var level = Number(h.tagName.charAt(1));
	      var hIndent = document.createElement("span");

	      while (level-- > 1) {
	        hIndent.innerHTML += "&emsp;&emsp;";
	      }

	      var title = document.createElement("div");
	      title.append(hIndent);
	      title.append(hLink);
	      tocBody.append(title);
	    });
	    codes.forEach(function (node, i) {
	      node.append(tocBox.cloneNode(true));
	    });
	  }
	};

	var Editor = /*#__PURE__*/function () {
	  function Editor(ele) {
	    this.element = ele;
	    this.element.innerHTML = Editor.Html.editor;
	    var codeContainer = this.element.querySelector(Editor.Selector.codeContainer);
	    var viewContainer = this.element.querySelector(Editor.Selector.viewContainer);
	    var codeToolbar = this.element.querySelector(Editor.Selector.codeToolbar);
	    var viewToolbar = this.element.querySelector(Editor.Selector.viewToolbar);
	    this.codeArea = new CodeArea(codeContainer, codeToolbar);
	    this.viewArea = new ViewArea(viewContainer, viewToolbar);
	  }

	  var _proto = Editor.prototype;

	  _proto.init = function init(config) {
	    var codeArea = this.codeArea;
	    var viewArea = this.viewArea;
	    codeArea.on("codechange", function () {
	      viewArea.show(codeArea.getValue());
	    });
	    this.initToolbar();
	    var codeConfig = null;
	    var viewConfig = null;
	    var width = "auto";
	    var height = "auto";

	    if (config) {
	      if (config.codeConfig) codeConfig = config.codeConfig;
	      if (config.viewConfig) viewConfig = config.viewConfig;
	      if (config.width) width = typeof Number(config.width) === "number" ? config.width + "px" : config.width;
	      if (config.height) height = typeof Number(config.height) === "number" ? config.height + "px" : config.height;
	    }

	    this.codeArea.init(codeConfig);
	    this.viewArea.init(viewConfig);
	    return this;
	  };

	  _proto.setSize = function setSize(width, height) {
	    this.height = height;
	    this.width = width;
	    this.resize(width, height);
	  };

	  _proto.resize = function resize(width, height) {
	    // if(width)this.element.style.width = typeof Number(width)==="number"?width+"px":width;
	    if (height) this.element.style.height = typeof Number(height) === "number" ? height + "px" : height;
	    var containerHeight = this.element.style.height.replace("px", "") - document.querySelector(Editor.Selector.editorToolbarTop).scrollHeight + "px";
	    this.codeArea.setSize(null, containerHeight);
	    this.viewArea.setSize(null, containerHeight);
	  };

	  _proto.initToolbar = function initToolbar() {
	    var _this = this;

	    var btnFullscreen = this.element.querySelector(Editor.Selector.btnFullscreen);
	    btnFullscreen.addEventListener("click", function () {
	      if (!document.fullscreenElement) {
	        _this.element.requestFullscreen();

	        _this.resize(window.screen.width, window.screen.height);
	      } else {
	        document.exitFullscreen();

	        _this.resize(_this.width, _this.height);
	      }
	    });
	    var editorContainer = this.element.querySelector(Editor.Selector.editorContainer);
	    var btnCodeArea = this.element.querySelector(Editor.Selector.btnCodeArea);
	    btnCodeArea.addEventListener("click", function () {
	      editorContainer.classList.remove("show-view");
	      editorContainer.classList.add("show-code");
	    });
	    var btnViewArea = this.element.querySelector(Editor.Selector.btnViewArea);
	    btnViewArea.addEventListener("click", function () {
	      editorContainer.classList.remove("show-code");
	      editorContainer.classList.add("show-view");
	    });
	    var btnSplitScreen = this.element.querySelector(Editor.Selector.btnSplitScreen);
	    btnSplitScreen.addEventListener("click", function () {
	      editorContainer.classList.remove("show-code", "show-view");
	    });
	  };

	  return Editor;
	}();

	Editor.CodeArea = CodeArea;
	Editor.ViewArea = ViewArea;
	Editor.Class = {
	  codeEditor: "code-editor",
	  editorContainer: "editor-container",
	  codeContainer: "code-container",
	  viewContainer: "view-container",
	  editorToolbarTop: "editor-toolbar-top",
	  editorToolbarBottom: "editor-toolbar-bottom",
	  codeToolbar: "code-toolbar",
	  commonToolbar: "common-toolbar",
	  viewToolbar: "view-toolbar",
	  btnFullscreen: "btn-fullscreen",
	  btnCodeArea: "btn-code-area",
	  btnViewArea: "btn-view-area",
	  btnSplitScreen: "btn-split-screen",
	  showCode: "show-code",
	  showView: "show-view"
	};
	Editor.Selector = {
	  editorToolbarTop: "." + Editor.Class.editorToolbarTop,
	  editorToolbarBottom: "." + Editor.Class.editorToolbarBottom,
	  editorContainer: "." + Editor.Class.editorContainer,
	  codeContainer: "." + Editor.Class.codeContainer,
	  viewContainer: "." + Editor.Class.viewContainer,
	  codeToolbar: "." + Editor.Class.codeToolbar,
	  viewToolbar: "." + Editor.Class.viewToolbar,
	  btnFullscreen: "." + Editor.Class.btnFullscreen,
	  btnCodeArea: "." + Editor.Class.btnCodeArea,
	  btnViewArea: "." + Editor.Class.btnViewArea,
	  btnSplitScreen: "." + Editor.Class.btnSplitScreen
	};
	Editor.Html = {
	  editor: "<div class=\"" + Editor.Class.codeEditor + "\">\n                <div class=\"" + Editor.Class.editorToolbarTop + "\">\n                    <div class=\"" + Editor.Class.codeToolbar + "\">\n                        <button class=\"editor-btn-fullscreen\">test</button>\n                    </div>\n                    <div class=\"" + Editor.Class.commonToolbar + "\">\n                        <button class=\"" + Editor.Class.btnFullscreen + "\">fullscreen</button>\n                        <button class=\"" + Editor.Class.btnCodeArea + "\">codeArea</button>\n                        <button class=\"" + Editor.Class.btnViewArea + "\">viewArea</button>\n                        <button class=\"" + Editor.Class.btnSplitScreen + "\">split screen</button>\n                    </div>\n                    <div class=\"" + Editor.Class.viewToolbar + "\">\n                        <button class=\"editor-btn-fullscreen\">test</button>\n                    </div>\n                </div>\n                <div class=\"" + Editor.Class.editorContainer + "\">\n<!--                    <div class=\"toolbar-left\"></div>-->\n                    <div class=\"" + Editor.Class.codeContainer + "\"></div>\n                    <div class=\"toolbar-center\"></div>\n                    <div class=\"" + Editor.Class.viewContainer + "\"></div>\n<!--                    <div class=\"toolbar-right\"></div>-->\n                </div>\n                <div class=\"" + Editor.Class.editorToolbarBottom + "\">\n                \n                </div>\n            </div>"
	};

	exports.Editor = Editor;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ViolinView.js.map
