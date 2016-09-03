var $ = function(selectors) {
	return document.querySelector(selectors);
};

var $$ = function(selectors) {
	return document.querySelectorAll(selectors);
};

function clsStimulusSys(spacecraft, speed, expend) {
	this.speed = ((speed / 10) || 3) - 2;
	this.expend = expend || 5;
	if( typeof this.fly != "function" ) {
		clsStimulusSys.prototype.fly = function(spacecraft) {
			spacecraft.flying = true;
			var speed = this.speed,
				expend = this.expend;
			spacecraft.selfElement.src = "firedspacecraft.png";
			spacecraft.selfElement.className += " fired-spacecraft";
			var delay = 10,
				_this = this;
			this.timer = setInterval(function() {
				if( spacecraft.power <= 0 ) {
					spacecraft.power = 0;
					_this.stopFlying(spacecraft);
					return ;
				}
				spacecraft.selfElement.style.left = spacecraft.circle.x - spacecraft.circle.radius * Math.cos(spacecraft.circle.angle * Math.PI / 180) + "px";
				spacecraft.selfElement.style.top = spacecraft.circle.y - spacecraft.circle.radius * Math.sin(spacecraft.circle.angle * Math.PI / 180) + "px";
				spacecraft.selfElement.style.transform = "rotate(" + spacecraft.circle.angle + "deg)";
				spacecraft.power -= expend * delay / 1000;
				spacecraft.circle.angle += speed;
				if( spacecraft.circle.angle >= 360 ) spacecraft.circle.angle = 0;
			}, delay);
		};

		clsStimulusSys.prototype.stopFlying = function(spacecraft) {
			spacecraft.flying = false;
			if( this.timer ) clearInterval(this.timer);
			spacecraft.selfElement.src = "spacecraft.png";
			spacecraft.selfElement.style.left = spacecraft.selfElement.offsetLeft + 5 + "px";
			spacecraft.selfElement.style.top = spacecraft.selfElement.offsetTop + 5 + "px";
			spacecraft.selfElement.className = spacecraft.selfElement.className.replace(/ fired-spacecraft/, "");
		};
	}
}

function clsEnergySys(spacecraft, recoverSpeed) {
	this.recoverSpeed = recoverSpeed || 2;
	if( typeof this.recover != "function" ) {
		clsEnergySys.prototype.recover = function(spacecraft) {
			var recoverSpeed = this.recoverSpeed,
				delay = 100,
				timer;
			this.timer = setInterval(function() {
				spacecraft.power += recoverSpeed * delay / 1000;
				if( spacecraft.power > 100 ) spacecraft.power = 100;
			}, delay);
		}
	}
	this.recover(spacecraft);
}

function clsSignalReceptionSys(spacecraft) {
	if( typeof this.receive != "function" ) {
		clsSignalReceptionSys.prototype.receive = function(message, spacecraft) {
			message = this.adapter(message);
			if( message.id != spacecraft.id ) return ;
			switch( message.command ) {
				case "start": spacecraft.fly(); break;
				case "stop": spacecraft.stopFlying(); break;
				case "destroy": spacecraft.destroy(); break;
			}
		};
		clsSignalReceptionSys.prototype.adapter = function(message){
			var newMessage = {};
			switch( message.slice(0, 4) ) {
				case "0001": newMessage.id = 1; break;
				case "0010": newMessage.id = 2; break;
				case "0100": newMessage.id = 3; break;
				case "1000": newMessage.id = 4; break;
			}
			switch( message.slice(4) ) {
				case "0010": newMessage.command = "start"; break;
				case "0100": newMessage.command = "stop"; break;
				case "1000": newMessage.command = "destroy"; break;
			}
			return newMessage;
		};
	}
}

function clsSignalTransmissionSys(spacecraft, singleBus) {
	if( typeof this.send != "function" ) {
		clsSignalTransmissionSys.prototype.send = function(message) {
			singleBus.receive(message);
		},
		clsSignalTransmissionSys.prototype.sendAdapter = function(jsonMessage) {
			var messageObj = JSON.parse(jsonMessage),
				message = messageObj.id.toString(2),
				energy = messageObj.energy.toString(2);
			while( message.length < 4 ) message = "0" + message;
			while( energy.length < 8 ) energy = "0" + energy;
			if( messageObj.status == "flying" ) message += "0001";
			else message += "0010";
			message += energy;
			this.send(message);
		}
	}
	this.timer = setInterval(function() {
		this.sendAdapter(JSON.stringify({
			id: parseInt(spacecraft.id),
			status: spacecraft.flying ? "flying" : "stop",
			energy: parseInt(spacecraft.power)
		}));
	}.bind(this), 300);

}

function clsSpaceCraft(track, speed, expend, recoverSpeed, singleBus) {
	this.id = track;
	this.power = 100;
	this.circle = {
		radius: 150 + 72 * (track - 1),
		x: 340,
		y: 330,
		angle: 0
	};
	this.selfElement = document.createElement("img");
	this.stimulusSys = new clsStimulusSys(this, speed, expend);
	this.energySys = new clsEnergySys(this, recoverSpeed);
	this.signalReceptionSys = new clsSignalReceptionSys(this);
	this.signalTransmissionSys = new clsSignalTransmissionSys(this, singleBus);
	this.flying = false;

	if( typeof this.show != "function" ) {
		clsSpaceCraft.prototype.show = function(track) {
			this.selfElement.src = "spacecraft.png";
			this.selfElement.className = "spacecraft-img spacecraft-" + track;
			trackWrap = $(".track-wrap" + track);
			trackWrap.insertBefore(this.selfElement, trackWrap.lastElementChild);
		};
		clsSpaceCraft.prototype.fly = function() {
			if( this.flying ) return ;
			this.stimulusSys.fly(this);
		};
		clsSpaceCraft.prototype.stopFlying = function() {
			if( !this.flying ) return ;
			this.stimulusSys.stopFlying(this);
		};
		clsSpaceCraft.prototype.destroy = function() {
			this.selfElement.parentNode.removeChild(this.selfElement);
			clearInterval(this.energySys.timer);
			clearInterval(this.signalTransmissionSys.timer);
			this.stimulusSys.stopFlying(this);
		};
	}
	this.show(track);
}

function clsMessage(id, command) {
	this.id = id;
	this.command = command;
}

(function() {
	var commandSys = $(".command-system"),
		singleMediator = (function() {
			return {
				lossRate: 0.3,
				delay: 1000,
				send: function(message, tracks, target) {
					if( Math.random() <= this.lossRate ) {
						target.disabled = false;
						return ;
					}
					message = JSON.parse(message);
					setTimeout(function() {
						if( message.command == "ready" ) {
							tracks[message.id - 1] = new clsSpaceCraft(message.id);
							var div = document.createElement("div");
							div.className = "track-" + message.id;
							div.innerHTML = '<label>对' + message.id + '号飞船下达指令：</label><button class="control-button" name="start-button" type="button">开始飞行</button><button class="control-button" name="stop-button" type="button">停止飞行</button><button class="control-button" name="destroy-button" type="button">销毁飞船</button>';
							commandSys.appendChild(div);
						}
						else {
							for( var i = 0, len = tracks.length; i < len; ++ i ) {
								if( tracks[i] ) {
									tracks[i].signalReceptionSys.receive(message, tracks[i]);
								}
							}
							if( message.command == "destroy" ) {
								commandSys.removeChild(target.parentNode);
								tracks[message.id - 1] = null;	
							}
						}
						target.disabled = false;
					}, this.delay);
				}
			};
		})(),
		singleBus = (function() {
			return {
				lossRate: 0.1,
				delay: 500,
				adapter: function(message) {
					var newMessage;
					message = JSON.parse(message);
					switch( message.id ) {
						case 1: newMessage = "0001"; break;
						case 2: newMessage = "0010"; break;
						case 3: newMessage = "0100"; break;
						case 4: newMessage = "1000"; break;
					}
					switch( message.command ) {
						case "start": newMessage += "0010"; break;
						case "stop": newMessage += "0100"; break;
						case "destroy": newMessage += "1000"; break;
					}
					return newMessage;
				},
				send: function(message, tracks, target) {
					if( Math.random() <= this.lossRate ) {
						this.send(message, tracks, target);
						return ;
					}
					setTimeout(function() {
						for( var i = 0, len = tracks.length; i < len; ++ i ) {
							if( tracks[i] ) {
								tracks[i].signalReceptionSys.receive(message, tracks[i]);
							}
						}
						if( message[4] == "1" ) {
							for( var id = 0; id < 4; ++ id ) {
								if( message[id] == "1" ) break;
							}
							id = 3 - id;
							commandSys.removeChild(target.parentNode);
							tracks[id] = null;
						}
						target.disabled = false;
					}, this.delay);
				},
				receive: function(message) {
					dc.dealAdapter(message);
				}
			};
		})(),
		dc = (function() {
		// craft[message.id] = {
		// 	 	status: message.status,
		// 	 	energy: message.energy
	 	//	};
			var craft = [undefined, null, null, null, null],
				craftElements = [undefined, null, null, null, null],
				monitorTable = $(".monitor-table");
			return {
				init: function(id, stimulusSys, energySys) {
					craft[id] = {
						status: "stop",
						energy: "100"
					};
					switch( stimulusSys ) {
						case "fram-stimulus": stimulusSys = "前进号"; break;
						case "pentium-stimulus": stimulusSys = "奔腾号"; break;
						case "beyond-stimulus": stimulusSys = "超越号"; break;
						case "superluminal-stimulus": stimulusSys = "超光速号"; break;
					}
					switch( energySys ) {
						case "energizer-energy": energySys = "劲量型"; break;
						case "light-energy": energySys = "光能型"; break;
						case "nuclear-energy": energySys = "核能型"; break;
						case "permanent-energy": energySys = "永久型"; break;
					}
					craftElements[id] = document.createElement("tr");
					craftElements[id].innerHTML = "<td>" + id + "号</td><td>" + stimulusSys + "</td><td>" + energySys + "</td><td>闲置中</td><td>100%</td>";
					monitorTable.appendChild(craftElements[id]);
				},

				destroy: function(id) {
					craft[id] = null;
			 		craftElements[id].parentNode.removeChild(craftElements[id]);
			 		craftElements[id] = null;
				},

			 	deal: function(jsonMessage) {
				 	var message = JSON.parse(jsonMessage);
				 	if( !craft[message.id] ) return ;
			 		if( craft[message.id].status != message.status  ) {
			 			craft[message.id].status = message.status;
			 			craftElements[message.id].children[3].innerHTML = message.status == "flying" ? "飞行中" : "闲置中";
			 		}
			 		if( craft[message.id].energy != message.energy ) {
			 			craft[message.id].energy = message.energy;
			 			craftElements[message.id].children[4].innerHTML = message.energy + "%";
			 		}
			 	},

			 	dealAdapter: function(message) {
					var craftId = parseInt(message.substr(0, 4), 2),
						craftEnergy = parseInt(message.slice(-8), 2),
						craftStatus;
					switch( message.substr(4, 4) ) {
						case "0001": craftStatus = "flying"; break;
						case "0010": craftStatus = "stop"; break;
					}
					
					this.deal(JSON.stringify({
						id: craftId,
						status: craftStatus,
						energy: craftEnergy
					}));
			 	}
			}
		})();

	var controlDiv = $(".control-wrap"),
		stimulusSys = $$("input[name=stimulus]"),
		energySys = $$("input[name=energy]"),
		tracks = [null, null, null, null];
	function buttonHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event),
			id = parseInt(target.parentNode.className.slice(-1)),
			command,
			speed,
			expend,
			recoverSpeed,
			message;
		switch( target.name ) {
			case "ready-button":
				for( var i = 0, len = tracks.length; i < len; ++ i ) {
					if( tracks[i] == null ) break;
				}
				if( i == tracks.length ) {
					alert("最多只能创建4架宇宙飞船！");
					return ;
				}
				id = i + 1;
				for( var i = 0, len = stimulusSys.length; i < len; ++ i ) {
					if( stimulusSys[i].checked ) {
						speed = stimulusSys[i].getAttribute("data-speed");
						expend = stimulusSys[i].getAttribute("data-expend");
						break;
					}
				}
				for( var j = 0, len = energySys.length; j < len; ++ j ) {
					if( energySys[j].checked ) {
						recoverSpeed = energySys[j].getAttribute("data-recoverspeed");
						break;
					}
				}
				dc.init(id, stimulusSys[i].getAttribute("id"), energySys[j].getAttribute("id"));
				tracks[id - 1] = new clsSpaceCraft(id, speed, expend, recoverSpeed, singleBus);
				var div = document.createElement("div");
				div.className = "track-" + id;
				div.innerHTML = '<label>对' + id + '号飞船下达指令：</label><button class="control-button" name="start-button" type="button">开始飞行</button><button class="control-button" name="stop-button" type="button">停止飞行</button><button class="control-button" name="destroy-button" type="button">销毁飞船</button>';
				commandSys.appendChild(div);
				return ;
			case "start-button": command = "start"; break;
			case "stop-button": command = "stop"; break;
			case "destroy-button": {
				command = "destroy"; 
				dc.destroy(id);
				break;
			}
			default: return;
		}
		target.disabled = true;
		message = JSON.stringify(new clsMessage(id, command));
		singleBus.send(singleBus.adapter(message), tracks, target);
	}
	EventUtil.addHandler(controlDiv, "click", buttonHandler);
})();
