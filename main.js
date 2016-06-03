// ローカルストレージからデータ読み込み
var task_data = [];
if (window.localStorage.getItem('task_data') != null) {
  task_data = JSON.parse(window.localStorage.getItem('task_data'));
}


// データを表示する
function displayTasks () {
  var ret = [];
  for (var i = task_data.length-1; i >= 0; i--) {
    var line = '<p>' + task_data[i]['taskName'] + ' ' + task_data[i]['val'] + '/' + task_data[i]['maxVal'];
    line += '<input type="button" value="-" onClick="updateTask(' + String(i) + ', -1)">';
    line += '<input type="button" value="+" onClick="updateTask(' + String(i) + ', +1)">';
    line += '<input type="button" value="削除" onClick="deleteTask(' + String(i)+ ')">';
    line += '</p>';
    ret.push(line);
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
