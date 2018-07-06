function AddNew() {
    var parentId = GetQueryString("nodeId");
    window.parent.location.href = "/Article/add?parentId=" + parentId;
}