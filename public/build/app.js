"use strict";var app=angular.module("app",["ui.router","ui.router.state.events","LocalStorageModule","ui.bootstrap","ngAnimate"]).run(["$rootScope","localStorageService",function(e,t){e.$on("$stateChangeStart",function(e,o){if(o.data&&o.data.auth){if("Anonymous"===o.data.auth&&t.cookie.get("token"))return e.preventDefault(),!1;if("Authorized"===o.data.auth&&!t.cookie.get("token"))return e.preventDefault(),!1}})}]);app.factory("memberListService",["requestService","urls",function(e,t){var o=[];return{getMembers:function(){return new Promise(function(n,s){e.sendRequest(t.members,"get").then(function(e){e.data?(!o.length&&Array.prototype.push.apply(o,e.data),n()):s()},function(e){s()})})},members:o}}]),app.factory("authService",["localStorageService","requestService","urls","chatService",function(e,t,o,n){var s={headers:{"Content-Type":"application/jsone;"}},i={token:e.cookie.get("token"),email:e.cookie.get("email"),id:e.cookie.get("id"),name:e.cookie.get("name"),surname:e.cookie.get("surname")},a={isSendingNow:!1},r={},c={};return i.token&&i.id&&n.connect(i.id,i.token).catch(u),{signIn:l,signUp:function(e){return new Promise(function(n,i){a.isSendingNow=!0,t.sendRequest(o.signUp,"post",null,e,s).then(function(e){a.isSendingNow=!1,e.config&&e.config.data?(l(JSON.parse(e.config.data),n),c.signUp=""):(c.signUp="Some error. Please, try sign up again.",i())},function(e){a.isSendingNow=!1,c.signUp=e,i()})})},signOut:function(){return new Promise(function(e,s){var a={Token:i.token};t.sendRequest(o.signOut,"post",a).then(function(){n.disconnect(),u(),e()},function(){u(),s()})})},authData:i,reqData:a,errorSignInMessages:r,errorSignOutMessages:{},errorSignUpMessages:c};function l(c,l){return new Promise(function(u,d){a.isSendingNow=!0,t.sendRequest(o.signIn,"post",null,c,s).then(function(t){a.isSendingNow=!1,t.data&&t.data.token&&t.data.id?(i.token=t.data.token,i.id=t.data.id,i.name=t.data.name,i.surname=t.data.surname,i.email=t.data.email,e.cookie.set("token",i.token),e.cookie.set("id",i.id),e.cookie.set("name",i.name),e.cookie.set("surname",i.surname),e.cookie.set("email",i.email),r.signIn="",l&&l(),n.connect(i.userId,i.token),u()):(r.signIn="Some error. Please, try sign in again.",d())},function(e){a.isSendingNow=!1,r.signIn=e,d()})})}function u(){e.cookie.remove("token"),e.cookie.remove("email"),e.cookie.remove("id"),e.cookie.remove("name"),e.cookie.remove("surname"),i.token="",i.email="",i.id="",i.name="",i.surname=""}}]),app.factory("chatService",["localStorageService","$rootScope","$anchorScroll","$location","notificationService","$state",function(e,t,o,n){var s,i,a,r={chats:[]},c=!1,l={};return{connect:function(){return new Promise(function(c,g){(s=io.connect({query:{token:e.cookie.get("token")}})).on("errorConnection",function(){s.removeAllListeners("errorConnection"),g()}),s.on("successConnection",function(e){e.chats.forEach(function(e){r.chats[e.id]=e}),l.id&&r.chats[l.id]&&(u(l.id),m(l.id)),t.$digest(),s.on("messageForClient",function(e){var s;o.add({author:e.author.name+" "+e.author.surname,text:e.text,chatId:e.ChatId}),h(e),l.id&&l.id==e.ChatId&&"chat"==n.current.name?m(e.ChatId):(s=e.ChatId,r.chats[s].Membership.counter++,t.$digest())}),s.on("newChatForClient",function(e){var t=e.Messages[0];o.add({author:t.author.name+" "+t.author.surname,text:t.text,chatId:t.ChatId}),e.Membership={counter:1},d(e)}),s.on("messageSended",function(e){h(e),i&&i()}),s.on("newChatCreated",function(e){e.Membership={counter:0},d(e),a&&a(e)}),s.removeAllListeners("successConnection"),c()})})},disconnect:function(){r.chats=[],s.removeAllListeners("messageForClient"),s.removeAllListeners("newChatForClient"),s.removeAllListeners("messageSended"),s.removeAllListeners("newChatCreated"),l.id="",s.emit("disconnect")},messageToNewChat:function(t,o){if(!t)return;return new Promise(function(n){a=n,s.emit("messageToNewChat",{token:e.cookie.get("token"),text:t,recipientId:o})})},messageToExistChat:function(t,o){if(!t)return;return new Promise(function(n){i=n,s.emit("messageToExistChat",{token:e.cookie.get("token"),text:t,chatId:o})})},getChatsByUser:function(e){var t;return r.chats.forEach(function(o){o.Users.forEach(function(n){n.id!==e||(t=o)})}),t},loadMessages:u,selectedChat:l,chatsData:r,cleanMsgCounter:m};function u(o){if(!c)return c=!0,new Promise(function(n){s.on("portionOfMessages",function(e){!function(e,o){if(!r.chats[e])return;r.chats[e].Messages||(r.chats[e].Messages=[]);o.forEach(function(t){r.chats[e].Messages.push(t)}),t.$digest()}(o,e),s.removeAllListeners("portionOfMessages"),c=!1,n()}),s.emit("loadMessages",{token:e.cookie.get("token"),from:r.chats[o].Messages?r.chats[o].Messages.length:0,chatId:o})})}function d(e){r.chats[e.id]=e,t.$digest()}function h(e){r.chats[e.ChatId].Messages||(r.chats[e.ChatId].Messages=[]),r.chats[e.ChatId].Messages.push(e),r.chats[e.ChatId].updatedAt=e.createdAt,t.$digest()}function m(t){t&&r.chats[t]&&(s.emit("cleanMsgCounter",{token:e.cookie.get("token"),chatId:t}),r.chats[t].Membership.counter=0)}}]),app.factory("notificationService",["$timeout","$state",function(e,t){var o=[],n=0;return{notifications:o,add:function(i){if("chat"===t.current.name)return;i.id=n,o.push(i),n++,e(function(){s(i.id)},3e3)},remove:s};function s(e){o.forEach(function(t,n){t.id===e&&o.splice(n,1)})}}]),app.factory("requestService",["$http","$q",function(e,t){return{sendRequest:function(o,n,s,i,a){var r=t.defer(),c={method:n,url:o,data:i?JSON.stringify(i):"",config:a||"",headers:s||""};return e(c).then(function(e){e&&r.resolve(e)},function(e){e&&r.reject(e.data.message)}),r.promise}}}]);var urls={blog:"http://localhost:3000/api/blog/",signIn:"http://localhost:3000/api/auth/signin/",signUp:"http://localhost:3000/api/auth/signup/",signOut:"http://localhost:3000/api/auth/logout/",members:"http://localhost:3000/api/user/",editProfile:"http://localhost:3000/api/user/edit-profile/",editPassword:"http://localhost:3000/api/user/edit-password/",post:"http://localhost:3000/api/post/",chat:"http://localhost:3000/api/chat/"};function authController(e,t){var o=this;o.errorSignInMessages=e.errorSignInMessages,o.errorSignUpMessages=e.errorSignUpMessages,o.reqAuthData=e.reqData,o.signIn=function(o){e.signIn(o).then(function(){t.go("member",{userId:e.authData.id})})},o.signUp=function(o){e.signUp(o).then(function(){t.go("member",{userId:e.authData.id})})}}function blogController(){}function chatController(e,t,o,n,s,i){var a=this,r=1;function c(t){r="1",a.selectedChat.id=t,a.chatsData.chats[t]&&(a.chatsData.chats[t].Messages||e.loadMessages(t),e.cleanMsgCounter(t))}a.chatsData=e.chatsData,a.selectChat=c,a.sendMessage=function(t){r="1",e.messageToExistChat(a.messageText,t),a.messageText=""},a.beginChat=function(){o.open({size:"sm",component:"chatBeginner"})},a.selectedChat=e.selectedChat,a.loadMessages=function(){a.chatsData.chats[a.selectedChat.id].Messages&&(r=a.chatsData.chats[a.selectedChat.id].Messages.length,e.loadMessages(a.selectedChat.id))},a.scrollToFunc=function(){i(function(){n.hash(r),s()},0)},t.chatId?c(t.chatId):a.selectedChat.id=""}function validateErrorsController(){var e=this;e.messages={required:"* This field is required",minlength:"* Too short value",maxlength:"* Too long value",email:"* Email is not valid",confirm:"* Passwords are not the same"},e.messageToggle=function(t){return!("confirm"===t&&Object.keys(e.errors).length>1||!e.show)}}function layoutController(e,t){this.authData=e.authData,this.errorSignOutMessages=e.errorSignOutMessages,this.signOut=function(){e.signOut().then(function(){"editProfile"!==t.current.name&&"chat"!==t.current.name||t.go("members")})}}function memberListController(e){e.getMembers();this.members=e.members,this.filterParams={searchOptions:["name","surname"]}}function editModalController(e){var t=this;t.blogReqData=e.reqData,t.postData={title:e.editedPost.title,text:e.editedPost.text},t.submitFunc=function(){e.editPost(e.editedPost.id,t.postData).then(function(){e.editedPost.title=t.postData.title,e.editedPost.text=t.postData.text,t.close()},t.close)}}function postListController(e,t,o){e.getPosts(t.userId);var n=this;n.posts=e.posts,n.userId=t.userId,n.removePost=function(t){var n=o.open({size:"sm",templateUrl:"build/views/blog/post-list/remove-modal.html",controllerAs:"$ctrl",controller:function(){this.removePost=function(){e.removePost(t).then(n.close)},this.close=n.close}})},n.openCreatingModal=function(){o.open({size:"sm",component:"postModal"})},n.openEdditingModal=function(t){e.editedPost=t,o.open({size:"sm",component:"editModal"})}}function postModalController(e){var t=this;t.blogReqData=e.reqData,t.submitFunc=function(){e.createPost(t.postData).then(t.close)}}function editProfileController(e,t){var o=t.cookie.get("id");e.getUserInfo(o),this.changePassword=function(t){e.changePassword(t)},this.editProfileData=function(t){e.editProfileData(t)},this.profileData=e.userInfo,this.notice=e.notice}function profileController(e,t){e.getUserInfo(t.userId),this.errorGettingMessages=e.notice.errorGettingMessages,this.info=e.userInfo}function chatBeginnerController(e,t,o,n){var s=this;s.sendMessage=function(){t.messageToNewChat(s.messageData.text,s.messageData.memberId).then(function(e){s.close(),o.go("chat",{chatId:e.id})})},s.members,s.userId=n.cookie.get("id"),e.getMembers().then(function(){s.members=[],e.members.forEach(function(e){var o=!1;t.chatsData.chats.forEach(function(t){t.Users.forEach(function(t){t.id!==e.id||(o=!0)})}),o||s.members.push(e)})})}function noticeController(){var e=this;e.$onInit=function(){for(var t in e.notice)e.notice[t]=""}}function notificationController(e,t){this.notifications=e.notifications,this.remove=e.remove,this.openChat=function(o,n){t.go("chat",{chatId:o}),e.remove(n)}}function profileFormController(){}function scrollTopDirective(){return{restrict:"A",scope:{handler:"&scrollTop"},link:function(e,t){t.on("scroll",function(t){0===t.target.scrollTop&&e.handler()})}}}function compareTo(){return{restrict:"A",require:"ngModel",scope:{otherModelValue:"=compareTo"},link:function(e,t,o,n){n.$validators.confirm=function(t){return t===e.otherModelValue},e.$watch("otherModelValue",function(){n.$validate()})}}}function messageModalSwitch(e,t){return{restrict:"A",scope:{member:"=sendMessageTo"},link:function(o,n){var s;function i(){var t=this;t.sendMessage=function(n){t.sendingIsNow=!0;var i=e.getChatsByUser(o.member.id);i?e.messageToExistChat(n.text,i.id).then(function(){s.close()}):e.messageToNewChat(n.text,o.member.id).then(function(){s.close()})},t.close=function(){s.close()}}n.bind("click",function(){s=t.open({templateUrl:"build/views/components/message-modal/message-modal.html",size:"sm",controller:i,controllerAs:"$ctrl"})})}}}app.constant("urls",urls),app.factory("postListService",["requestService","authService","urls",function(e,t,o){var n=[],s={},i={isCreatingNow:!1,removedPost:""},a={headers:{"Content-Type":"application/jsone;"}};return{getPosts:function(t){return new Promise(function(i,a){n.splice(0,n.length),e.sendRequest(o.blog+t,"get").then(function(e){e.data?(Array.prototype.push.apply(n,e.data),s.gettingPosts="",i()):(s.gettingPosts="No available posts.",a())},function(e){s.gettingPosts=e,a()})})},posts:n,reqData:i,editedPost:{},errorMessages:s,removePost:function(a){return new Promise(function(r,c){var l={Token:t.authData.token};i.removedPost=a,e.sendRequest(o.post+a,"delete",l).then(function(){s.removingPost="";for(var e=0;e<n.length;e++)n[e].id===i.removedPost&&n.splice(e,1);r()},function(e){s.removingPost=e,c()})})},createPost:function(r){return new Promise(function(c,l){var u={Token:t.authData.token};i.isCreatingNow=!0,e.sendRequest(o.post,"post",u,r,a).then(function(e){i.isCreatingNow=!1,e.data?(n.push(e.data),s.creatingPost="",c()):(s.creatingPost="Somthing error. Please, try reload page.",l())},function(e){s.creatingPost=e,i.isCreatingNow=!1,l()})})},editPost:function(n,r){return new Promise(function(c,l){var u={Token:t.authData.token};i.isCreatingNow=!0,e.sendRequest(o.post+n,"put",u,r,a).then(function(e){i.isCreatingNow=!1,s.creatingPost="",c()},function(e){s.edditingPost=e,i.isCreatingNow=!1,l()})})}}}]),app.factory("profileService",["requestService","urls","authService","localStorageService",function(e,t,o,n){var s={},i={errorGettingMessages:{},errorProfileMessages:{},errorPasswordMessages:{},successProfileMessages:{},successPasswordMessages:{}},a={isSendingNow:!1};return{getUserInfo:function(o){return new Promise(function(){e.sendRequest(t.members+o,"get").then(function(e){e&&e.data&&(i.gettingUserInfo="",s.name=e.data.name,s.surname=e.data.surname,s.description=e.data.description,s.id=e.data.id,s.email=e.data.email)},function(e){i.errorGettingMessages=e,s.name="",s.surname="",s.description="",s.id="",s.email=""})})},editProfileData:function(s){var r={headers:{"Content-Type":"application/jsone;"}},c={Token:o.authData.token};return new Promise(function(l){a.isSendingNow=!0,e.sendRequest(t.editProfile+o.authData.id,"put",c,s,r).then(function(){o.authData.email=s.email,n.cookie.set("email",s.email),i.errorProfileMessages.editProfile="",i.successProfileMessages.editProfile="Profile is successfully edited!",a.isSendingNow=!1,l()},function(e){a.isSendingNow=!1,i.errorProfileMessages.editProfile=e,i.successProfileMessages.editProfile=""})})},changePassword:function(n){var s={headers:{"Content-Type":"application/jsone;"}},r={Token:o.authData.token};return new Promise(function(o){a.isSendingNow=!0,console.log(t.editPassword),e.sendRequest(t.editPassword,"put",r,n,s).then(function(){a.isSendingNow=!1,i.errorPasswordMessages.changePassword="",i.successPasswordMessages.changePassword="Password is successfully edited!",o()},function(e){a.isSendingNow=!1,i.errorPasswordMessages.changePassword=e,i.successPasswordMessages.changePassword=""})})},userInfo:s,notice:i,reqData:a}}]),app.filter("filter",function(){return function(e,t){if(!t.searchText)return e;var o=JSON.parse(JSON.stringify(e)),n=[],s=t.caseSensetive?t.searchText:t.searchText.toLowerCase(),i="any"!==t.searchBy?[t.searchBy]:t.searchOptions;return o.forEach(function(o,a){var r=!1;i.forEach(function(e){o[e]=t.caseSensetive?o[e]:o[e].toLowerCase(),(t.fullMatch?o[e]===s:o[e].indexOf(s)>-1)&&(r=!0)}),(r=t.negative?!r:r)&&n.push(e[a])}),n}}),app.component("auth",{templateUrl:"build/views/auth/auth.html",controller:["authService","$state",authController]}),app.component("blog",{templateUrl:"build/views/blog/blog.html",controller:[blogController],bindings:{authData:"<"}}),app.component("chat",{templateUrl:"build/views/chat/chat.html",controller:["chatService","$stateParams","$uibModal","$location","$anchorScroll","$timeout",chatController],bindings:{authData:"<"}}),app.component("validateErrors",{bindings:{errors:"<",show:"<"},template:'<div class="text-danger" ng-repeat="(key, value) in $ctrl.errors" ng-if="$ctrl.messageToggle(key)">{{$ctrl.messages[key]}}</div>',controller:[validateErrorsController]}),app.component("layout",{templateUrl:"build/views/layout/layout.html",controller:["authService","$state",layoutController]}),app.component("memberList",{templateUrl:"build/views/member-list/member-list.html",controller:["memberListService",memberListController],bindings:{authData:"<"}}),app.component("editModal",{templateUrl:"build/views/blog/post-list/post-modal.html",bindings:{close:"&"},controller:["postListService",editModalController]}),app.component("postList",{templateUrl:"build/views/blog/post-list/post-list.html",controller:["postListService","$stateParams","$uibModal",postListController],bindings:{authData:"<"}}),app.component("postModal",{templateUrl:"build/views/blog/post-list/post-modal.html",bindings:{close:"&"},controller:["postListService",postModalController]}),app.component("editProfile",{templateUrl:"build/views/blog/profile/edit-profile.html",controller:["profileService","localStorageService",editProfileController]}),app.component("profile",{templateUrl:"build/views/blog/profile/profile.html",controller:["profileService","$stateParams",profileController],bindings:{authData:"<"}}),app.component("chatBeginner",{bindings:{resolve:"<",close:"&"},templateUrl:"build/views/chat/chat-beginner/chat-beginner.html",controller:["memberListService","chatService","$state","localStorageService",chatBeginnerController]}),app.component("notice",{bindings:{notice:"=",danger:"<"},templateUrl:"build/views/components/notice/notice.html",controller:[noticeController]}),app.component("notificationMessages",{templateUrl:"build/views/components/notification/notification.html",controller:["notificationService","$state",notificationController]}),app.component("profileForm",{bindings:{title:"@",isSendingNow:"<",profile:"<",submitFunc:"<",errors:"<"},templateUrl:"build/views/components/profile-form/profile-form.html",controller:[profileFormController]}),app.directive("scrollTop",scrollTopDirective),app.directive("compareTo",compareTo),app.directive("sendMessageTo",["chatService","$uibModal",messageModalSwitch]),app.config(["$urlRouterProvider",function(e){e.otherwise("/")}]),app.config(["$stateProvider",function(e){e.state("auth",{url:"/auth",component:"auth",data:{auth:"Anonymous"}})}]),app.config(["$stateProvider",function(e){e.state("member",{url:"/:userId",component:"blog",resolve:{authData:["authService",function(e){return e.authData}]}}),e.state("editProfile",{url:"/editProfile",component:"editProfile",data:{auth:"Authorized"}})}]),app.config(["$stateProvider",function(e){e.state("chat",{url:"/chat/:chatId",component:"chat",data:{auth:"Authorized"},resolve:{authData:["authService",function(e){return e.authData}]}})}]),app.config(["$stateProvider",function(e){e.state("members",{url:"/",component:"memberList",resolve:{authData:["authService",function(e){return e.authData}]}})}]);