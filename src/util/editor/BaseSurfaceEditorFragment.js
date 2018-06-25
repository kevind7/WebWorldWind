/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports BaseSurfaceEditorFragment
 */
define([
        '../../geom/Angle',
        '../../geom/Location',
        '../Logger',
        '../../shapes/Path',
        '../../shapes/Placemark',
        '../../geom/Position',
        '../../shapes/ShapeAttributes',
        '../../error/UnsupportedOperationError',
        '../../geom/Vec3'
    ],
    function (Angle,
              Location,
              Logger,
              Path,
              Placemark,
              Position,
              ShapeAttributes,
              UnsupportedOperationError,
              Vec3) {
        "use strict";

        // Internal use only.
        var BaseSurfaceEditorFragment = function () {};

        /**
         * Returns a value indicating whether this fragment can handle the specified shape.
         *
         * @param {SurfaceShape} shape The shape to test.
         * @return {Boolean} <code>true</code> if this fragment can handle the specified shape; otherwise
         * <code>false</code>.
         */
        BaseSurfaceEditorFragment.prototype.canHandle = function (shape) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "canHandle",
                "abstractInvocation")
            );
        };

        /**
         * Creates and return a shadow shape from the specified shape.
         *
         * The shadow shape must be a deep copy, i.e. acting on the properties of the specified shape afterwards must
         * not alter the appearance of the shadow shape.
         *
         * @param {SurfaceShape} shape The base shape to create a shadow from.
         * @return {SurfaceShape} The shadow shape created from the specified base shape.
         */
        BaseSurfaceEditorFragment.prototype.createShadowShape = function (shape) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "createShadowShape",
                "abstractInvocation")
            );
        };

        /**
         * Returns the location at the center of the specified shape.
         *
         * @param {SurfaceShape} shape The shape to get the center from.
         * @param {Globe} globe The globe on which the shape is edited.
         * @return {Location} The location at the center of the specified shape.
         */
        BaseSurfaceEditorFragment.prototype.getShapeCenter = function (shape, globe) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "getShapeCenter",
                "abstractInvocation")
            );
        };

        /**
         * Initializes the control elements required to edit the specified shape.
         *
         * This method must create the elements, but not position them. Their positioning is handled by
         * {@link BaseSurfaceEditorFragment#updateControlElements}.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Renderable[]} controlPoints The array to store control points in.
         * @param {Renderable[]} accessories The array to store additional accessories in.
         * @param {PlacemarkAttributes} resizeControlPointAttributes The attributes to use for control points that
         * resize the shape.
         * @param {PlacemarkAttributes} rotateControlPointAttributes The attributes to use for control points that
         * rotate the shape.
         * @param {PlacemarkAttributes} moveControlPointAttributes The attributes to use for control points that move
         * the boundaries of the shape.
         */
        BaseSurfaceEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                  controlPoints,
                                                                                  accessories,
                                                                                  resizeControlPointAttributes,
                                                                                  rotateControlPointAttributes,
                                                                                  moveControlPointAttributes) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "initializeControlElements",
                "abstractInvocation")
            );
        };

        /**
         * Updates the control elements required to edit the specified shape.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Globe} globe The globe on which the shape is edited.
         * @param {Renderable[]} controlPoints The array that stores the control points.
         * @param {Renderable[]} accessories The array that stores the additional accessories.
         */
        BaseSurfaceEditorFragment.prototype.updateControlElements = function (shape,
                                                                              globe,
                                                                              controlPoints,
                                                                              accessories) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "updateControlElements",
                "abstractInvocation")
            );
        };

        /**
         * Reshapes the specified shape by applying the appropriate effect when the given control point is moved from
         * the previous location to the current location.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Globe} globe The globe on which the shape is edited.
         * @param {Renderable} controlPoint The control point being acted on.
         * @param {Position} currentPosition The current position for this action.
         * @param {Position} previousPosition The previous position for this action.
         * @param {Boolean} secondaryBehavior A value indicating whether the secondary behavior of this action should be
         * performed or not.
         */
        BaseSurfaceEditorFragment.prototype.reshape = function (shape,
                                                                globe,
                                                                controlPoint,
                                                                currentPosition,
                                                                previousPosition,
                                                                secondaryBehavior) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "reshape",
                "abstractInvocation")
            );
        };

        // Creates a control point and adds it to the array of control points.
        BaseSurfaceEditorFragment.prototype.createControlPoint = function(controlPoints, attributes, purpose, index) {
            var controlPoint = new Placemark(new Location(0, 0), false, attributes);

            controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND

            controlPoint.userProperties.purpose = purpose;

            if (typeof index !== "undefined") {
                controlPoint.userProperties.index = index;
            }

            controlPoints.push(controlPoint);
        };

        // Computes the cartesian difference between two positions such as control points.
        BaseSurfaceEditorFragment.prototype.computeControlPointDelta = function (globe, positionA, positionB) {
            var pointA = globe.computePointFromPosition(
                positionA.latitude,
                positionA.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            var pointB = globe.computePointFromPosition(
                positionB.latitude,
                positionB.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            return pointA.subtract(pointB);
        };

        // Creates an accessory showing the rotation of a shape and adds it to the array of accessories.
        BaseSurfaceEditorFragment.prototype.createRotationAccessory = function (accessories, attributes) {
            var positions = [];
            positions.push(new Position(0, 0, 0));
            positions.push(new Position(0, 0, 0));

            var shapeAttributes = new ShapeAttributes(null);
            shapeAttributes.outlineColor = attributes.imageColor;
            shapeAttributes.outlineWidth = 2;

            var rotationLine = new Path(positions, shapeAttributes);
            rotationLine.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            rotationLine.followTerrain = true;

            accessories.push(rotationLine);
        };

        // Updates the heading of the accessory showing the rotation of the shape.
        BaseSurfaceEditorFragment.prototype.updateRotationAccessory = function (centerPosition, controlPointPosition, accessories) {
            accessories[0].positions = [centerPosition, controlPointPosition];
        };

        // Applies a delta to a heading and normalizes it.
        BaseSurfaceEditorFragment.prototype.normalizedHeading = function (currentHeading, deltaHeading) {
            var newHeading = currentHeading * Angle.DEGREES_TO_RADIANS + deltaHeading * Angle.DEGREES_TO_RADIANS;

            if (Math.abs(newHeading) > Angle.TWO_PI) {
                newHeading = newHeading % Angle.TWO_PI;
            }

            return Angle.RADIANS_TO_DEGREES * (newHeading >= 0 ? newHeading : newHeading + Angle.TWO_PI);
        };





        /**
         * Computes the average location of a specified array of locations.
         * @param {Location[]} locations The array of locations for the shape.
         * @return {Position} the average of the locations specified in the array.
         */
        BaseSurfaceEditorFragment.prototype.getCenter = function (globe, locations) {
            var count = 0;
            var center = new Vec3(0, 0, 0);

            if (locations.length > 0 && locations[0].length > 2) {
                for (var i = 0; i < locations.length; i++) {
                    for (var j = 0; j < locations[i].length; j++) {
                        center = center.add(globe.computePointFromPosition(
                            locations[i][j].latitude,
                            locations[i][j].longitude,
                            0,
                            new Vec3(0, 0, 0)));
                        ++count;
                    }
                }
            }
            else if (locations.length >= 2) {
                for (var i = 0; i < locations.length; i++) {
                    center = center.add(globe.computePointFromPosition(
                        locations[i].latitude,
                        locations[i].longitude,
                        0,
                        new Vec3(0, 0, 0)));
                    ++count;
                }
            }

            center = center.divide(count);

            return globe.computePositionFromPoint(
                center[0],
                center[1],
                center[2],
                new Position(0, 0, 0)
            );
        };

        /**
         * Computes the average distance between a specified center point and a list of locations.
         * @param {Globe} globe The globe to use for the computations.
         * @param {Location} center The center point.
         * @param {Array} locations The locations.
         * @returns {Number} The average distance.
         */
        BaseSurfaceEditorFragment.prototype.getAverageDistance = function (globe, center, locations) {
            var count = locations.length;

            var centerPoint = globe.computePointFromLocation(
                center.latitude,
                center.longitude,
                new Vec3(0, 0, 0)
            );

            var totalDistance = 0;
            for (var i = 0; i < locations.length; i++) {
                var distance = globe.computePointFromLocation(
                    locations[i].latitude,
                    locations[i].longitude,
                    new Vec3(0, 0, 0)).distanceTo(centerPoint);
                totalDistance += distance / count;
            }

            return (count === 0) ? 0 : totalDistance / globe.equatorialRadius;
        };

        BaseSurfaceEditorFragment.prototype.addNewControlPoint = function (globe, terrainPosition, altitude, locations) {
            // Find the nearest edge to the picked point and insert a new position on that edge.
            var pointPicked = globe.computePointFromPosition(
                terrainPosition.latitude,
                terrainPosition.longitude,
                altitude,
                new Vec3(0, 0, 0)
            );

            var nearestPoint = null;
            var nearestSegmentIndex = 0;
            var nearestDistance = Number.MAX_VALUE;
            for (var i = 1; i <= locations.length; i++) // <= is intentional, to handle the closing segment
            {
                // Skip the closing segment if the shape is not a polygon.
                if (!(this._shape instanceof SurfacePolygon ) && i == locations.length) {
                    continue;
                }

                var locationA = locations[i - 1];
                var locationB = locations[i == locations.length ? 0 : i];

                var pointA = globe.computePointFromPosition(
                    locationA.latitude,
                    locationA.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointB = this._worldWindow.globe.computePointFromPosition(
                    locationB.latitude,
                    locationB.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointOnEdge = this.nearestPointOnSegment(pointA, pointB, new Vec3(pointPicked[0], pointPicked[1], pointPicked[2]));

                var distance = pointOnEdge.distanceTo(pointPicked);
                if (distance < nearestDistance) {
                    nearestPoint = pointOnEdge;
                    nearestSegmentIndex = i;
                    nearestDistance = distance;
                }
            }

            if (nearestPoint) {
                // Compute the location of the nearest point and add it to the shape.
                var nearestLocation = globe.computePositionFromPoint(
                    nearestPoint[0],
                    nearestPoint[1],
                    nearestPoint[2],
                    new Position(0, 0, 0)
                );

                if (nearestSegmentIndex == locations.length)
                    locations.push(nearestLocation);
                else
                    locations.splice(nearestSegmentIndex, 0, nearestLocation);

                this.removeControlPoints();
                this._shape.boundaries = locations;
                this.updateControlElements();
            }
        };

        BaseSurfaceEditorFragment.prototype.deepCopyLocations = function(locations) {
            var newLocations = [];

            if (locations.length > 0 && locations[0].length > 2) {
                for (var i = 0, ilen = locations.length; i < ilen; i++) {
                    var ring = [];
                    for (var j = 0, jlen = locations[i].length; j < jlen; j++) {
                        ring.push(new Location(locations[i][j].latitude, locations[i][j].longitude));
                    }
                    newLocations.push(ring);
                }
            } else {
                for (var i = 0, len = locations.length; i < len; i++) {
                    newLocations.push(new Location(locations[i].latitude, locations[i].longitude));
                }
            }

            return newLocations;
        }

        BaseSurfaceEditorFragment.prototype.nearestPointOnSegment = function (p1, p2, point) {
            var segment = p2.subtract(p1);

            var segmentCopy = new Vec3(0, 0, 0);
            segmentCopy.copy(segment);
            var dir = segmentCopy.normalize();

            var dot = point.subtract(p1).dot(dir);
            if (dot < 0.0) {
                return p1;
            }
            else if (dot > segment.magnitude()) {
                return p2;
            }
            else {
                return Vec3.fromLine(p1, dot, dir); // FIXME This is broken
            }
        };

        /**
         * Moves a control point location.
         * @param {Placemark} controlPoint The control point being moved.
         * @param {Position} terrainPosition The position selected by the user.
         * @returns {Position} The position after move.
         */
        BaseSurfaceEditorFragment.prototype.moveLocation = function (globe, controlPoint, terrainPosition, previousPosition, result) {
            var delta = this.computeControlPointDelta(globe, previousPosition, terrainPosition);
            var markerPoint = globe.computePointFromPosition(
                controlPoint.position.latitude,
                controlPoint.position.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            markerPoint.add(delta);
            return globe.computePositionFromPoint(
                markerPoint[0],
                markerPoint[1],
                markerPoint[2],
                result
            );
        };

        /**
         * Rotates a shape's locations.
         * @param {Position} terrainPosition The position selected by the user.
         * @param {Location[]} locations The array of locations for the shape.
         */
        BaseSurfaceEditorFragment.prototype.rotateLocations = function (globe, terrainPosition, previousPosition, locations) {
            var center = this.getCenter(globe, locations);
            var previousHeading = Location.greatCircleAzimuth(center, previousPosition);
            var deltaHeading = Location.greatCircleAzimuth(center, terrainPosition) - previousHeading;

            if (locations.length > 0 && locations[0].length > 2) {
                for (var i = 0; i < locations.length; i++) {
                    for (var j = 0; j < locations[i].length; j++) {
                        var heading = Location.greatCircleAzimuth(center, locations[i][j]);
                        var distance = Location.greatCircleDistance(center, locations[i][j]);
                        Location.greatCircleLocation(center, heading + deltaHeading, distance,
                            locations[i][j]);
                    }
                }
            }
            else if (locations.length >= 2) {
                for (var i = 0; i < locations.length; i++) {
                    var heading = Location.greatCircleAzimuth(center, locations[i]);
                    var distance = Location.greatCircleDistance(center, locations[i]);
                    Location.greatCircleLocation(center, heading + deltaHeading, distance,
                        locations[i]);
                }
            }

            return deltaHeading;
        };

        return BaseSurfaceEditorFragment;
    }
);