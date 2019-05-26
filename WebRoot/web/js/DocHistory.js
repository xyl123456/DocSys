	//DocHistory类
	var DocHistory = (function () {
		//These value is for commit
		var reposId;
		var docId;
		var pid;
		var parentPath = "";
		var docName = "";
		var docPath = "";
		var historyType = 0;
		
		function historyLogsPageInit(Input_vid, Input_docId, Input_pid, Input_path, Input_name, Input_historyType)
		{
			console.log("historyLogsPageInit vid:" + Input_vid + " docId:" + Input_docId + " pid:" + Input_pid + " path:" + Input_path + " name:" + Input_name + " historyType:" + Input_historyType);
			reposId = Input_vid;
			docId = Input_docId;
			pid = Input_pid;
			parentPath = Input_path;	
			docName = Input_name;
			docPath = Input_path + Input_name;
			historyType = Input_historyType;
			
			showHistoryLogList(reposId, docId, pid, parentPath, docName, historyType);	
		}
	
		function downloadHistory(index)
		{
			var commitId = $("#commitId" + index).text();
		   	console.log("downloadHistory() commitId:" +commitId  + " reposId:" + reposId  + " docId:"+ docId + " parentPath:" + parentPath + " docName:" + docName + " historyType:" + historyType);
	
		   	var encParentPath = encodeURI(parentPath);
		   	var encDocName = encodeURI(docName);
		   	window.location.href = "/DocSystem/Doc/getHistoryDoc.do?commitId=" + commitId + "&reposId=" + reposId + "&docId=" + docId + "&path=" + encParentPath + "&name="+encDocName + "&historyType=" + historyType;	
		}
		
		function revertHistory(index)
		{
			var commitId = $("#commitId" + index).text();
		   	console.log("revertHistory() commitId:" +commitId  + " reposId:" + reposId + " docId:"+ docId + " parentPath:" + parentPath + " docName:" + docName + " historyType:" + historyType);
	
		   	var encParentPath = encodeURI(parentPath);
		   	var encDocName = encodeURI(docName);
		   	
	   		$.ajax({
	             url : "/DocSystem/Doc/revertDocHistory.do",
	             type : "post",
	             dataType : "json",
	             data : {
	            	 commitId: commitId,
	                 reposId : reposId,
	                 pid: pid,
	                 docId: docId,
	            	 path : encParentPath,
	             	 name: encDocName,
	             	 historyType: historyType,
	             },
	             success : function (ret) {
	             	if( "ok" == ret.status){
	        		  	console.log(ret.data);
	        		  	alert("恢复成功！");
	                }
	                else
	                {
	                	showErrorMessage("历史版本恢复失败:" + ret.msgInfo);
	                }
	            },
	            error : function () {
	                showErrorMessage("历史版本恢复失败:服务器异常");
	            }
	        });
		}
		
		function showHistoryDetail(index)
		{
			var commitId = $("#commitId" + index).text();
		   	console.log("revertHistory() commitId:" +commitId  + " reposId:" + reposId + " docId:"+ docId + " parentPath:" + parentPath + " docName:" + docName + " historyType:" + historyType);
	
		   	var encParentPath = encodeURI(parentPath);
		   	var encDocName = encodeURI(docName);
		   	
	   		$.ajax({
	             url : "/DocSystem/Doc/getHistoryDetail.do",
	             type : "post",
	             dataType : "json",
	             data : {
	            	 commitId: commitId,
	                 reposId : reposId, 
	                 pid: pid,
	                 docId: docId,
	            	 path : encParentPath,
	             	 name: encDocName,
	             	 historyType: historyType,
	             },
	             success : function (ret) {
	             	if( "ok" == ret.status){
	        		  	console.log(ret.data);
	        		  	showList(ret.data);
	                }
	                else
	                {
	                	showErrorMessage("获取历史版本详情失败:" + ret.msgInfo);
	                }
	            },
	            error : function () {
	                showErrorMessage("获取历史版本详情失败:服务器异常");
	            }
	        });
	   		
			//根据获取到的列表数据，绘制列表
			function showList(data){
				
			}
		}
	
		function showHistoryLogList(reposId, docId, pid, parentPath, docName, historyType)
		{
	   		console.log("showHistoryLogList  reposId:" + reposId + " docId:"+ docId + " pid:" + pid + " parentPath:" + parentPath + " docName:" + docName + " historyType:" + historyType);
	    	$.ajax({
	             url : "/DocSystem/Doc/getDocHistory.do",
	             type : "post",
	             dataType : "json",
	             data : {
	                 reposId : reposId, 
	                 docId: docId,
	                 pid: pid,
	            	 path : parentPath,
	             	 name: docName,
	             	 historyType: historyType,
	             	 maxLogNum: 100,
	             },
	             success : function (ret) {
	             	if( "ok" == ret.status){
	        		  	console.log(ret.data);
	        		  	showList(ret.data);
	                }
	                else
	                {
	                	showErrorMessage("获取历史信息失败:" + ret.msgInfo);
	                }
	            },
	            error : function () {
	                showErrorMessage("获取历史信息失败:服务器异常");
	            }
	        });
	
			//根据获取到的列表数据，绘制列表
			function showList(data){
				console.log(data);
				var c = $("#historyLogs").children();
				$(c).remove();
				if(data.length==0){
					$("#historyLogs").append("<p>暂无数据</p>");
				}
				
				for(var i=0;i<data.length;i++){
					var d = data[i];
					var commitId = d.commitId;
					var commitUser = d.commitUser;
					var commitMsg = d.commitMsg;
					var commitTime = formatTime(d.commitTime);
					
					var opBtn = "		<a href='javascript:void(0)' onclick='showHistoryDetail("+i+ ")' class='mybtn-primary' style='margin-bottom:20px'>详情</a>";							
					var opBtn1 = "		<a href='javascript:void(0)' onclick='downloadHistory("+i+ ")' class='mybtn-primary' style='margin-bottom:20px'>下载</a>";
					var opBtn2 = "		<a href='javascript:void(0)' onclick='revertHistory("+i+ ")' class='mybtn-primary'>还原</a>";
					var se = "<li id='popover" +i+"' + + value="+ i +">"
						+"	<i class='cell commitId w10'>"
						+"		<span class='name  breakAll'>"
						+"			<a id='commitId"+i+"' href='javascript:void(0)'>"+commitId+"</a>"
						+"		</span>"
						+"	</i>"
						+"	<i class='cell commitMsg w30'>"
						+"		<span class='name breakAll'>"
						+"			<a id='commitMsg"+i+"' href='javascript:void(0)'>"+commitMsg+"</a>"
						+"		</span>"
						+"	</i>"
						+"	<i class='cell commitUser w13'>"
						+"		<span class='name'>"
						+"			<a id='commitUser"+i+"' href='javascript:void(0)'>"+commitUser+"</a>"
						+"		</span>"
						+"	</i>"
						+"	<i class='cell commitTime w10'>"
						+"		<span class='name'>"
						+"			<a id='commitTime"+i+"' href='javascript:void(0)'>"+commitTime+"</a>"
						+"		</span>"
						+"	</i>"
						+"	<i class='cell operation w10'>"
						+		opBtn
						+ 		opBtn1 
						+ 		opBtn2 
						+"	</i>"
						+"</li>";
					
					$("#historyLogs").append(se);
				}
				
				//Set popover details
				/*for(var i=0;i<data.length;i++){
					var d = data[i];
					
					var changedItems = d.changedItems;
					var changedPaths = "";
					for(var j=0;j<changedItems.length;j++){
						changedItem = changedItems[i];
						changedPaths = changedPaths + changedItem.changeType + "  "+ changedItem.path + "<br>";	
					}
					console.log(changedPaths);
					
					var detail = "<p>commitId:" + d.commitId + "<br>" 
					+"Message:" + d.commitMsg + "<br>"
					+"Author:" + d.commitUser + "<br>"
					+"Date:" + d.commitTime + "<br>"
					+"changePaths:<br>" 
					+ changedPaths
					+"</p>"
					console.log(detail);
					
					$("#popover" + i).bspop({
					    title   : "详情",
					    content : detail,
					});	
				}*/
			}
		}
		
		//开放给外部的调用接口
	    return {
	    	historyLogsPageInit: function(vid, docId, pid, path, name, type){
	    		historyLogsPageInit(vid, docId, pid, path, name, type);
	        },
	        
	        downloadHistory: function(index){
	        	downloadHistory(index);
	        },
	        
	    };
	})();