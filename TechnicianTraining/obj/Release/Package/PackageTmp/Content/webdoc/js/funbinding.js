// JavaScript Document
var FunBinding = function()
{
	//Delete
	var Ele_Delete = document.getElementsByClassName("Delete");
	for(i=0;i<Ele_Delete.length;i++)
	{
		Ele_Delete.item(i).onclick = function()
		{
			if(this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("fieldset").length >= 2)
			{
				this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode);
			}
		}
	}
	//Append Heading
	var Ele_Heading = document.getElementsByClassName("Heading");
	for(i=0;i<Ele_Heading.length;i++)
	{
		Ele_Heading.item(i).onclick = function()
		{
			AppendComponent.Heading(this);
		}
	}
	//Append Paragraph
	var Ele_Paragraph = document.getElementsByClassName("Paragraph");
	for(i=0;i<Ele_Paragraph.length;i++)
	{
		Ele_Paragraph.item(i).onclick = function()
		{
			AppendComponent.Paragraph(this);
		}
	}
	//Append Images
	var Ele_Images = document.getElementsByClassName("Images");
	for(i=0;i<Ele_Images.length;i++)
	{
		Ele_Images.item(i).onclick = function()
		{
			AppendComponent.Images(this);
		}
	}
	//Append Video
	var Ele_Video = document.getElementsByClassName("Video");
	for(i=0;i<Ele_Video.length;i++)
	{
		Ele_Video.item(i).onclick = function()
		{
			AppendComponent.Video(this);
		}
	}
}

function insertAfter(newEl, targetEl)
{
	var parentEl = targetEl.parentNode;
	
	if(parentEl.lastChild == targetEl)
	{
		parentEl.appendChild(newEl);
	}else
	{
		parentEl.insertBefore(newEl,targetEl.nextSibling);
	}            
}

var AppendComponent = {};
AppendComponent.Heading = function(a)
{
var box = document.createElement("fieldset");
	box.setAttribute("class","container");
var content = "<legend>";
	content +="	<b class=\"Heading\"><i>标题</i></b>";
	content +="	<em><q class=\"Delete\"><i>删除</i></q></em>";
	content +="</legend>";
	content +="<h2 class=\"newContent\" contenteditable=\"true\"></h2>";
	content +="<hr>";
	content +="<ul class=\"tool\">";
	content +="	<li><p class=\"Heading\"><i>追加标题</i></p></li>";
	content +="	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
	content +="	<li><p class=\"Images\"><i>追加图片</i></p></li>";
	content +="	<li><p class=\"Video\"><i>追加视频</i></p></li>";
	content +="</ul>";
	box.innerHTML = content;
	insertAfter(box,a.parentNode.parentNode.parentNode);
	FunBinding();
	FunctionOfContentBox();
}

AppendComponent.Paragraph = function(a)
{
var box = document.createElement("fieldset");
	box.setAttribute("class","container");
var content = "<legend>";
	content +="	<b class=\"Paragraph\"><i>段落</i></b>";
	content +="		<em><q class=\"Delete\"><i>删除</i></q></em>";
	content +="</legend>";
	content +="<p class=\"newContent\" contenteditable=\"true\"></p>";
	content +="<hr>";
	content +="<ul class=\"tool\">";
	content +="	<li><p class=\"Heading\"><i>追加标题</i></p></li>";
	content +="	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
	content +="	<li><p class=\"Images\"><i>追加图片</i></p></li>";
	content +="	<li><p class=\"Video\"><i>追加视频</i></p></li>";
	content +="</ul>";
	box.innerHTML = content;
	insertAfter(box,a.parentNode.parentNode.parentNode);
	FunBinding();
	FunctionOfContentBox();
}

AppendComponent.Images = function(a)
{
var box = document.createElement("fieldset");
	box.setAttribute("class","container");
var content = "<legend><b class=\"Images\"><i>图片</i></b><em><q class=\"Delete\"><i>删除</i></q></em></legend>";
	content += "<span class=\"explain\">说明：图片大小不超过2MB，支持格式：jpg、png、gif、svg。</span>";
	content += "<div class=\"imgBox\">";
	content += "	<img src=\"/Content/webdoc/img/images.svg\">";
	content += "	<input type=\"file\">";
	content += "</div>";
	content += "<hr>";
	content += "<ul class=\"tool\">";
	content += "	<li><p class=\"Heading\"><i>追加标题</i></p></li>";
	content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
	content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
	content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
	content += "</ul>";
	box.innerHTML = content;
	insertAfter(box,a.parentNode.parentNode.parentNode);
	FunBinding();
	FunctionOfContentBox();
}

AppendComponent.Video = function(a)
{
var box = document.createElement("fieldset");
	box.setAttribute("class","container");
var content = "<legend><b class=\"Video\">视频</b><em><q class=\"Delete\"><i>删除</i></q></em></legend>";
	content += "<span class=\"explain\">说明：视频大小不超过200MB，支持格式：MP4。</span>";
	content += "<div class=\"videoBox\">";
	content += "	<video controls width=\"100%\">";
	content += "		<source src=\"\" type=\"video/mp4\" />";
	content += "		Your browser does not support the video tag.";
	content += "</video>";
	content += "<input type=\"file\" onchange='Start(this)'><span class='process'></span>";
	content += "</div>";
	content += "<hr>";
	content += "<ul class=\"tool\">";
	content += "	<li><p class=\"Heading\"><i>追加标题</i></p></li>";
	content += "	<li><p class=\"Paragraph\"><i>追加段落</i></p></li>";
	content += "	<li><p class=\"Images\"><i>追加图片</i></p></li>";
	content += "	<li><p class=\"Video\"><i>追加视频</i></p></li>";
	content += "</ul>";
	box.innerHTML = content;
	insertAfter(box,a.parentNode.parentNode.parentNode);
	FunBinding();
	FunctionOfContentBox();
}