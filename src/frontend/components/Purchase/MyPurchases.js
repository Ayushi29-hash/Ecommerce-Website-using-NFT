import React from 'react'
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from "react-bootstrap";

var aryan =15
export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          seller: metadata.sellername,
          description: metadata.description,
          image: metadata.image,
          Warranty: metadata.Warranty,
          NFTtime: metadata.dateString,
          category: metadata.category,
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  let ownedList = {
    0: "Aryan",
    1: "Aryan",
    2: "Aryan",
    3: "Aryan",
  };
  return (
    <div className="w-90 h-50 m-3" data-aos="zoom-in">
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-5" data-aos="zoom-in">
        {purchases.map((item, idx) => (
          <Col key={idx} className="overflow-hidden" data-aos="zoom-in">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body color="secondary">
                <Card.Title>{item.name}</Card.Title>
                <br></br>
                  <Button
                    id="color"
                    size="lg"
                  >
                    {item.Warranty - aryan} Days left
                  </Button>
              </Card.Body>
              <div className="details mt-1">
                  <div class="center">
                    <h1>{item.description}</h1>
                    <p>
                      <b>OwnedBy:</b>
                      {ownedList[idx]}
                    </p>
                    <p>
                    <b>seller:</b>
                      {item.seller}
                    </p>
                    <p>
                      <b>NFT:</b>
                      {item.NFTtime}
                    </p>
                    <p>
                      <b>Category:</b> {item.category}
                    </p>
                  </div>
                </div>
              {item.Warranty - aryan > 0 ? (
                <Card.Footer>
                  Brought For :{ethers.utils.formatEther(item.totalPrice)} MATIC
                  Recieved{ethers.utils.formatEther(item.price)} MATIC
                </Card.Footer>
                
              ) : (
                <Button variant="secondary" size="lg">
                  Out Of Warranty
                </Button>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}