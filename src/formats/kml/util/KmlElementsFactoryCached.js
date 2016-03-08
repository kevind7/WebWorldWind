/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './Attribute',
    './KmlElementsFactory',
    './TreeKeyValueCache',
    '../../../util/WWUtil'
], function (
    Attribute,
    KmlElementsFactory,
    TreeKeyValueCache,
    WWUtil
) {
    "use strict";

    /**
     * More complex factory, which retrieves the values from cache and in case the value isn't present there it
     * stores the value in cache.
     * @constructor
     */
    var KmlElementsFactoryCached = function() {
        this.internalFactory = new KmlElementsFactory();
        this.cache = new TreeKeyValueCache();
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory all method.
     * @param element {KmlObject} Element whose children are considered
     * @returns {KmlObject[]} All objects among the elements children
     * @see KmlElementsFactory.prototype.all
     */
    KmlElementsFactoryCached.prototype.all = function(element){
        var parentNode = element.node;
        var children = this.cache.level(this.cacheKey(element.node));
        if (children) {
            var results = [];
            for(var key in children) {
                if(children.hasOwnProperty(key)) {
                    results.push(children[key]);
                }
            }
            return results;
        }

        var elements = this.internalFactory.all(element);

        var self = this;
        elements.forEach(function(element){
            self.cache.add(self.cacheKey(parentNode), self.cacheKey(element.node), element);
        });
        return elements;
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory specific method.
     * @param element {KmlObject} Element whose children are considered
     * @param options {Object}
     * @param options.name {String} Name of the element to retrieve from the element
     * @param options.transformer {Function} Function returning correct value. It accepts the node and returns value.
     *  This mechanism can be used for the attributes as well.
     * @returns Relevant value.
     * @see KmlElementsFactory.prototype.specific
     */
    KmlElementsFactoryCached.prototype.specific = function(element, options){
        var parentNode = element.node;
        var child = this.cache.value(this.cacheKey(parentNode), options.name);
        if (child) {
            return child;
        }

        var result = this.internalFactory.specific(element, options);
        
        this.cache.add(this.cacheKey(parentNode), this.cacheKey(result.node), result);
        return result;
    };

    /**
     * It adds caching functionality on top of the KmlElementsFactory any method.
     * @param element {KmlObject} Element whose children are considered
     * @param options {Object}
     * @param options.name {String[]} Array of the names among which should be the one we are looking for.
     * @returns {KmlObject|null} KmlObject if there is one with the passed in name.
     * @see KmlElementsFactory.prototype.any
     */
    KmlElementsFactoryCached.prototype.any = function(element, options){
        var parentNode = element.node;

        var self = this;
        var child = null;
        var potentialChild;
        options.name.forEach(function(name){
            potentialChild = self.cache.value(self.cacheKey(parentNode), name);
            if(potentialChild) {
                child = potentialChild;
            }
        });
        if (child) {
            return child;
        }

        var result = this.internalFactory.any(element, options);

        this.cache.add(self.cacheKey(parentNode), self.cacheKey(result.node), result);
        return result;
    };

    /**
     * It creates cache key based on the node. In case the node doesn't have any id, it also creates id for this
     * element. This id is used for storing the value in the cache.
     * @param node {Node} Node for which generate the key.
     * @returns {String} Value representing the key.
     */
    KmlElementsFactoryCached.prototype.cacheKey = function(node) {
        var idAttribute = new Attribute(node, "id");
        if (!idAttribute.exists()) {
            idAttribute.save(WWUtil.guid());
        }
        return node.nodeName + "#" + idAttribute.value();
    };

    var applicationWide = new KmlElementsFactoryCached();
    /**
     * It returns application wide instance of the factory.
     * @returns {KmlElementsFactoryCached} Singleton instance of factory for Application.
     */
    KmlElementsFactoryCached.applicationWide = function(){
        return applicationWide;
    };

    return KmlElementsFactoryCached;
});