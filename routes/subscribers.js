const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

router.get('/', async (req, res) => {
    try{
        const subscribers = await Subscriber.find()
        res.send(subscribers)
    }catch(err){
        res.status(500).send({message: err.message})
    }
})

router.get('/:id', getSubscriber, (req, res) => {
    res.send(res.subscriber);
})

router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscriberToChannel: req.body.subscriberToChannel
    })
    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (error) {
        res.send(400).json({message: error.message})
    }
})

router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }
    
    if(req.body.subscriberToChannel != null){
        res.subscriber.subscriberToChannel = req.body.subscriberToChannel
    }
    try{
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getSubscriber, async(req, res) => {
    try {
        await res.subscriber.remove();
        res.json({message: "Subscriber deleted"})
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

async function getSubscriber(req, res, next){
    let subscriber;
    try {
        subscriber = await Subscriber.findById(req.params.id);
        if(subscriber == null){
            return res.status(404).json({message: "No such user found"});
        }
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
    res.subscriber = subscriber;
    next()
}

module.exports = router;