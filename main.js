// ローカルストレージからデータ読み込み
var task_data = [];
if (window.localStorage.getItem('task_data') != null) {
  task_data = JSON.parse(window.localStorage.getItem('task_data'));
}


// データを表示する
function displayTasks () {
  var ret = [];
  for (var i = task_data.length-1; i >= 0; i--) {
    var line = '<tr>'
    line += '<td class="col-xs-6 text-center">' + task_data[i]['taskName'] + '</td>'
    line += '<td class="col-xs-2 text-center">' + task_data[i]['val'] + '/' + task_data[i]['maxVal'] + '</td>';
    line += '<td class="col-xs-4 text-center">';
    line += '<div class="row form-group form-inline">'
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', -10)">-10</button></div>'
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', -1)"> - </button></div>'
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ',  1)"> + </button></div>'
    line += '<div class="col-md-2"><button type="button" class ="btn btn-default" onClick="updateTask(' + String(i) + ', 10)">+10</button></div>'
    line += '<div class="col-md-4"><button type="button" class ="btn btn-danger" onClick="deleteTask(' + String(i)+ ')">削除</button></div>'
    line += '</div>'
    line += '</td>';
    line += '</tr>';
    ret.push(line);
    console.log(line);
  }
  $($('.task-list')).html(ret);
}
displayTasks();

// ローカルストレージに保存
function setData () {
  window.localStorage.setItem('task_data', JSON.stringify(task_data));
}

// タスクを追加
function addTask () {
  var task_name = document.getElementById("task").value;
  document.getElementById("task").value = '';
  var max_val = document.getElementById("val").value;
  document.getElementById("val").value = '';
  max_val = Number(max_val);

  //入力が数字でなければreturn
  if (isNaN(max_val) || max_val == 0) {
    alert('0以外の数字を入力！');
    return;
  }
  task_data.push({'taskName': task_name, 'val': 0, 'maxVal': max_val});
  displayTasks();
  setData();
}

// タスクを更新
function updateTask (task_id, change_val) {
  task_data[task_id]['val']+=change_val;
  displayTasks();
  setData();
}

// タスクを削除
function deleteTask (task_id) {
  task_data.splice(task_id, 1);
  displayTasks();
  setData();
}
