import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var homeClusters = [];
var awayClusters = [];
var homeMarkers = [];
var awayMarkers = [];
var markerSize = 0.5;

class Cluster {

    constructor (max, min) {
        this._max = max;
        this._min = min;
        this._markers = [];
    }

    addMarker(marker){
        this._markers.push(marker);

        if ((marker - markerSize > 0) && (marker - markerSize < this._min)) {
            this._min = marker - markerSize;
        }

        if (marker + markerSize > this._max) {
            this._max = marker + markerSize;
        }
    }

    markerFits(marker){

        if (this._markers.length > 1) {
            var d1 = this._min - (marker + markerSize);
            var d2 = (marker - markerSize) - this._max;

            if ((d1 > 0) || (d2 > 0)) {
                return (false);
            } else {
                return (true);
            }
        } else {

            if (marker === this._markers[0]) {
                return(true);
            }

            if ( ((this._markers[0] - marker <= 2*markerSize)&& this._markers[0] - marker > 0)||(( marker - this._markers[0] <= 2*markerSize) && marker - this._markers[0] > 0) ) {
                return(true);
            } else {
                return(false);
            }
        }
    }
}

var addCluster = function(marker, clusters){
    var c = new Cluster(marker+markerSize, marker-markerSize);

    c.addMarker(marker);
    clusters.push(c);
}

var Hello = React.createClass({
    displayName: 'Hello',
    period: 1,
    statics: {
        alertMessage: function () {
            alert('static message');
        }
    },
    getInitialState: function() {
        return {
            items: []
        };
    },
    init: function (time) {
        this.period = time;
    },
    addItem: function (timeInSeconds, team: Enum) {
        var itemArray = this.state.items,
            period = this.period,
            reg = /[.0-9]+$/;

        if (reg.test(timeInSeconds)) {
            if (period !== undefined) {
                var bound = period / 10;
                var length = 10 * period;

                if (timeInSeconds < length - bound && timeInSeconds > bound) {
                    var position = (timeInSeconds * 100)/(10 * period);
                    team.HOME ? team = 'home': team = 'away';

                    itemArray.push({
                        key: Date.now(),
                        position: position,
                        team: team
                    });

                    this.setState({
                        items: itemArray
                    });
                }
            }
        }
    },

    render: function () {
        return (
            <div className="timeLine">
                <div className='ruler'>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <div className='cm'></div>
                    <TodoItems entries={this.state.items}/>
                </div>
            </div>
        );
    }
});

var TodoItems = React.createClass({

    groupMarkers: function (m, c) {
        for (var i = m.length; i > 0; i--) {
            var marker = m.pop();

            if (!c.length) {
                addCluster(marker, c);
            } else {
                var matches = false;

                for (var j = c.length; j > 0; j--) {
                    var cluster = c[j-1];

                    if (cluster.markerFits(marker)) {
                        matches = true;
                        cluster.addMarker(marker);
                        break;
                    }
                }
                if (!matches) {
                    addCluster(marker, c);
                }
            }
        }
    },

    render: function() {
        var todoEntries = this.props.entries;

        homeMarkers = [];
        awayMarkers = [];

        homeClusters = [];
        awayClusters = [];

        todoEntries.map(function(e) {
            if (e.team === "away") {
                awayMarkers.push(e.position);
            } else {
                homeMarkers.push(e.position);
            }
        });

        this.groupMarkers(awayMarkers, awayClusters);
        this.groupMarkers(homeMarkers, homeClusters);

        var listItems = awayClusters.map(function(cluster){
            var style = {};
            var className = "";
            var key;

            if (cluster._markers.length === 1) {
                style = {
                    left: cluster._markers[0] + '%'
                };
                className = 'marker ' + 'away';
                key= Date.now();

                return (
                    <div className={className} style={style} key={key}></div>
                );
            } else {
                style = {
                    left: cluster._markers[0] + '%'
                };
                className = 'table ' + 'away';
                key= Date.now();

                return (
                    <div className={className} style={style} key={key}>{cluster._markers.length}</div>
                );
            }
        });

        var newListItems = homeClusters.map(function(cluster){
            var style = {};
            var className = "";
            var key;

            if (cluster._markers.length === 1) {
                style = {
                    left: cluster._markers[0] + '%'
                };
                className = 'marker ' + 'home';
                key= Date.now();

                return (
                    <div className={className} style={style} key={key}></div>
                );
            } else {
                style = {
                    left: cluster._markers[0] + '%'
                };
                className = 'table ' + 'home';
                key= Date.now();

                return (
                    <div className={className} style={style} key={key}>{cluster._markers.length}</div>
                );
            }
        });

        return (
            <div>
                {listItems}
                {newListItems}
            </div>
        );
    }
});

var HelloElement = React.createElement(Hello, {
    name: "World"
});

var HelloRendered = ReactDOM.render(HelloElement, document.getElementById('root'));
HelloRendered.addItem("hi")

window.addAction = function () {

    HelloRendered.addItem(arguments[0], arguments[1])
}

window.init = function (lengthOfPeriodInSeconds) {
    HelloRendered.init(lengthOfPeriodInSeconds)
}
