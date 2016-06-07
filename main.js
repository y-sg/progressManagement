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

// データを表示する
function displayTasks () {
  if (isLogin() == 'ng') return;

  var task_data = getData();
  var ret = [];
  for (var i = task_data.length-1; i >= 0; i--) {
    var line = '<tr>';
    line += '<td class="col-xs-6 text-center">' + task_data[i]['taskName'] + '</td>';
    line += '<td class="col-xs-2 text-center">' + task_data[i]['val'] + '/' + task_data[i]['maxVal'] + '</td>';
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
    console.log(line);
  }
  $($('.task-list')).html(ret);
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
