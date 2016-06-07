// サーバーからデータ読み込み
function getData(){
  var result = '';
  $.ajax({
            type: 'get',
            url: 'twitter.php?f=getData',
            dataType : 'jsonp',
            scriptCharset: 'utf-8',
            async: false
        }).done(function(data, textStatus, XMLHttpRequest){
          result = data;
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        });
    return result;
}

function isLogin() {
  var result = '';
  $.ajax({
            type: 'get',
            url: 'twitter.php?f=isLogin',
            dataType : 'jsonp',
            scriptCharset: 'utf-8',
            async: false
        }).done(function(data, textStatus, XMLHttpRequest){
            console.log(data);
            result = data;
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        });
    return result;
}

// グラフ描画
function setGraph (maxVal, val, id) {
// http://www.openspc2.org/reibun/D3.js/code/graph/horizontal-bar/3001/index.html

	var list = [val];
	var svgWidth = 200; // SVG領域の横幅
	var svgHeight = 16;    // SVG領域の縦幅
	var barScale = 200/maxVal;   // 2倍サイズで描画
	var yBarSize = 16;  // 棒グラフの縦幅
	var xOffset = 0;    // 横方向のオフセット
	var svg = d3.select(id).append("svg")
	    .attr("width", svgWidth).attr("height", svgHeight)
	var bar = svg.selectAll("rect") // SVGでの四角形を示す要素を指定
	    .data(list) // データを設定
	    .enter()
	    .append("rect") // SVGでの四角形を示す要素を生成
	    .attr("x", xOffset) // 横棒グラフなのでX座標は0+オフセット。これはSVG上での座標
	    .attr("y", function(d,i){   // Y座標を配列の順序に応じて計算
	        return i * yBarSize;
	    })
	    .attr("width", function(d){ // 横幅を配列の内容に応じて計算
	        return "0px";
	    })
	    .attr("height", "16")   // 棒グラフの高さを指定
	    .attr("style", "fill:rgb(0,240,0)") // 棒グラフの色を赤色に設定
	// 目盛りを表示するためにスケールを設定
	var xScale = d3.scale.linear()  // スケールを設定
	    .domain([0, maxVal])   // 元のサイズ
	    .range([0, 200]);  // 実際の出力サイズ
	// 目盛りを設定し表示する
	svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate("+xOffset+", "+list.length*yBarSize+")");
	// アニメーション処理
	bar
	.transition()
	.attr("width", function(d){ // 横幅を配列の内容に応じて計算
	    return (d*barScale) +"px";
	})
	svg.selectAll("text")
	   .data(list)
	   .enter()
	   .append("text")
		 .text(function(d) {
				return (String(d) + '/' + String(maxVal));
		})
		.attr("x", function( d ) {
			return Math.max(0, (d * barScale - (String(d) + '/' + String(maxVal)).length * 11 ) );
		})
	  .attr("y", 12);
}


// データを表示する
function displayTasks () {
  if (isLogin() == 'ng') return;

  var task_data = getData();
  var ret = [];
  for (var i = task_data.length-1; i >= 0; i--) {
    var line = '<tr>';
    line += '<td class="col-xs-4 text-center">' + task_data[i]['taskName'] + '</td>';
    line += '<td class="col-xs-4 text-center" id = "graph'+ String(i) + '"></td>';
    line += '<td class="col-xs-4 text-center">';
    line += '<div class="row form-group form-inline">';
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', -10)">-10</button></div>';
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', -1)"> - </button></div>';
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ',  1)"> + </button></div>';
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', 10)">+10</button></div>';
    line += '<div class="col-md-4"><button type="button" class ="btn btn-danger" onClick="deleteTask(' + String(i)+ ')">削除</button></div>';
    line += '</div>';
    line += '</td>';
    line += '</tr>';
    ret.push(line);
  }
  $($('.task-list')).html(ret);
  for (var i = task_data.length-1; i >= 0; i--) {
    setGraph(task_data[i]['maxVal'], task_data[i]['val'], '#graph'+ String(i));
  }
}
displayTasks();

// ログインチェック
$.ajax({
          type: 'get',
          url: 'twitter.php?f=isLogin',
          dataType : 'jsonp',
          scriptCharset: 'utf-8'
      }).then(function(data, textStatus, XMLHttpRequest){
        if (data == 'ok') {
          $.ajax({
                    type: 'get',
                    url: 'twitter.php?f=getImageUrl',
                    dataType : 'jsonp',
                    scriptCharset: 'utf-8'
                }).done(function(data, textStatus, XMLHttpRequest){

                    $($('.login')).html('<div class = "navbar-right"><a class="navbar-brand" href="#"><img src="' + data + '" width="20" height="20" border="0" /></a><button type="button" class ="btn btn-success navbar-btn" onClick="location.href=\'./logout.php\'">ログアウト</button></div>');
                }).fail(function(XMLHttpRequest, textStatus, errorThrown){
                    alert(errorThrown);
                });
        }
        else {
          $($('.login')).html('<button type="button" class ="btn btn-success navbar-btn navbar-right" onClick="location.href=\'./login.php\'">ログイン</button>');
        }
      },function(XMLHttpRequest, textStatus, errorThrown){
          alert(errorThrown);
      });

// サーバに保存
function setData (task_data) {
  if (isLogin() == 'ng') return;

  $.ajax({
            type: 'get',
            url: 'twitter.php?f=setData&setData='+JSON.stringify(task_data),
            dataType : 'jsonp',
            scriptCharset: 'utf-8'
        }).done(function(data, textStatus, XMLHttpRequest){
          displayTasks();
        }).fail(function(XMLHttpRequest, textStatus, errorThrown){
            alert(errorThrown);
        });
}

// タスクを追加
function addTask () {
  if (isLogin() == 'ng') return;

  var task_data = getData();
  var task_name = document.getElementById("task").value;
  document.getElementById("task").value = '';
  var max_val = document.getElementById("val").value;
  document.getElementById("val").value = '';
  max_val = Number(max_val);

  //入力が数字でなければreturn
  if (isNaN(max_val) || max_val === 0) {
    alert('0以外の数字を入力！');
    return;
  }
  task_data.push({'taskName': task_name, 'val': 0, 'maxVal': max_val});
  setData(task_data);
}

// タスクを更新
function updateTask (task_id, change_val) {
  if (isLogin() == 'ng') return;

  var task_data = getData();
  task_data[task_id]['val']+=change_val;
  setData(task_data);
}

// タスクを削除
function deleteTask (task_id) {
  if (isLogin() == 'ng') return;

  var task_data = getData();
  task_data.splice(task_id, 1);
  setData(task_data);
}
