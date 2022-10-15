import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Listed_items.css";
var aryan = Math.floor(Math.random() * (100 - 1)) + 1;
function renderSoldItems(items) {
  let ownedList = {
    0: "Rohith",
    1: "Neha",
    2: "Arya",
    3: "Dsha",
    4: "Jhanvi",
    5: "Kruti",
    6: "Shrath",
    7: "Badri",
    8: "Dhnush",
  };
  AOS.init();
  return (
    <div className="w-90 h-50 m-3" data-aos="zoom-in">
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-5" data-aos="zoom-in">
        {items.map((item, idx) => (
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

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [listedItems, setListedItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount();
    let listedItems = [];
    let soldItems = [];
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx);
      if (i.seller.toLowerCase() === account) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let item = {
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
        };
        listedItems.push(item);
        // Add listed item to sold items array if sold
        if (i.sold) soldItems.push(item);
      }
    }
    setLoading(false);
    setListedItems(listedItems);
    setSoldItems(soldItems);
  };
  useEffect(() => {
    loadListedItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center" data-aos="zoom-in">
      {listedItems.length > 0 ? (
        <div className="w-90 h-50 m-3" data-aos="zoom-in">
          <h2>Listed</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3" data-aos="zoom-in">
            {listedItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden" data-aos="zoom-in">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Body color="secondary">
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <br></br>
                      <Button id="color" size="lg">
                        {item.Warranty - aryan} Days left
                      </Button>
                      {item.Warranty - aryan > 0 ? (
                        <Button variant="secondary" size="lg">
                          {ethers.utils.formatEther(item.totalPrice)} MATIC
                        </Button>
                      ) : (
                        <Button variant="secondary" size="lg">
                          Out Of Warranty Period
                        </Button>
                      )}
                    </Card.Body>
                  </Card.Body>
                  <div className="details mt-1">
                    <div class="center">
                      <h1>{item.description}</h1>
                      <p>
                        <b>OwnedBy:</b>
                        {item.seller}
                      </p>
                      <p>
                        <b>NFT:</b>
                        {item.NFTtime}
                      </p>
                      <p>
                        <b>Warranty:</b> {item.Warranty - aryan} Days
                      </p>
                      <p>
                        <b>Category:</b> {item.category}
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          {soldItems.length > 0 && renderSoldItems(soldItems)}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
}
