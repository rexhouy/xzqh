(function () {
  window.xzqh = (function () {
    var self = {};

    var _data; // {name: "", code: "", level: ""}
    var _selected = [];
    var _callback;
    self.open = function (names, callback) {
      $(".xzqh-selecter").show();
      $("#xzqh_backdrop").addClass("show").show();
      _callback = callback;
      $.getJSON("/xzqh.json", function (d) {
        _data = d.data;
        _selected = findNodeByNames(names);
        $("#xzqh_selects").removeClass("invisible");
        $("#xzqh_spinner").hide();
        if (_selected.length > 0) {
          self.select(_selected[_selected.length - 1].code, true);
        } else {
          self.select(null, true);
        }
      });
    };

    self.close = function () {
      $(".xzqh-selecter").hide();
      $("#xzqh_backdrop").removeClass("show").hide();
    };

    // 选中某个节点，继续选择下一个节点
    self.select = function (code, block) {
      if (!code) {
        _selected.splice(0, _selected.length);
        openSelect(1);
        renderSelected();
        return;
      }
      var node = findNodeByCode(code, _data);
      _selected[Number(node.level) - 1] = node;
      // 更改了父节点则需要清空子节点
      if (_selected.length > node.level) {
        _selected.splice(node.level, _selected.length);
      }
      renderSelected();

      if (openSelect(node.level + 1)) {
        // 继续选择子节点
      } else if (block) {
        openSelect(node.level);
      } else {
        // 没有子节点可选，结束
        _callback(
          _selected.map(function (d) {
            return d.name;
          })
        );
        self.close();
      }
    };

    var selectedName = function () {
      var s = "";
      for (var i = 0; i < _selected.length; i++) {
        s = s + _selected[i].name;
      }
      return s;
    };

    // 绘制选择信息
    var renderSelected = function () {
      var container = $("#xzqh_selects").empty();
      var template = $("#xzqh_select_template").html();
      var renderSelect = true;
      for (var i = 0; i < _selected.length; i++) {
        var node = _selected[i];
        var d = { name: node.name, parentCode: i > 0 ? _selected[i - 1].code : "" };
        if (!node.children) {
          d.color = "text-primary";
          renderSelect = false;
        }
        console.log(d);
        container.append(Mustache.render(template, d));
      }
      _selected.forEach(function (node) {});
      if (renderSelect) {
        var parentCode = _selected.length > 0 ? _selected[_selected.length - 1].code : "";
        container.append(Mustache.render(template, { name: "请选择", parentCode: parentCode, color: "text-primary" }));
      }
    };

    var openSelect = function (level) {
      var c = level == 1 ? { children: _data } : _selected[level - 2];
      if (c && c.children) {
        var template = $("#xzqh_option_template").html();
        var container = $("#xzqh_options").empty();
        c.children.forEach(function (d) {
          container.append(Mustache.render(template, d));
        });
        $("#xzqh_options").animate({ scrollTop: 0 });
        return true;
      }
      return false;
    };

    var findNodeByCode = function (code, tree) {
      if (!tree) {
        return tree;
      }
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].code == code) {
          return tree[i];
        }
        var x = findNodeByCode(code, tree[i].children);
        if (x) {
          return x;
        }
      }
    };

    var findNodeByNames = function (names) {
      var node = { children: _data };
      var ret = [];
      for (var i = 0; i < names.length; i++) {
        if (!names[i]) {
          break;
        }
        var node = findNodeByName(names[i], node.children);
        if (!node) {
          break;
        }
        ret.push(node);
      }
      return ret;
    };

    var findNodeByName = function (name, tree) {
      if (!tree) {
        return tree;
      }
      for (var i = 0; i < tree.length; i++) {
        if (tree[i].name == name) {
          return tree[i];
        }
      }
    };

    return self;
  })();
})();
