import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card, Button } from "react-bootstrap";
import Slider from "../Carousel/Slider";
import AOS from "aos";
import "aos/dist/aos.css";
import "./card.css";

const Home = ({ marketplace, nft }) => {
  AOS.init();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  // var aryan = Math.floor(Math.random() * (50 - 1)) + 1;
  var aryan = 16;

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: metadata.sellername,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          Warranty: metadata.Warranty,
          NFTtime: metadata.dateString,
          category: metadata.category,
        });
      }
    }
    setLoading(false);
    setItems(items);
  };

  const buyMarketItem = async (item) => {
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    alert("Message sent to user!");
    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center" data-aos="zoom-in">
      <Slider />
      {/* <CarouselContainer /> */}
      {items.length > 0 ? (
        <div className="w-90 h-50 m-3" data-aos="zoom-in">
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
                  {item.Warranty - aryan> 0 ?<Button
                    onClick={() => buyMarketItem(item)}
                    variant="secondary"
                    size="lg"
                  >
                    Buy for {ethers.utils.formatEther(item.totalPrice)} MATIC
                  </Button> : <Button
                    variant="secondary"
                    size="lg"
                  >
                    Out Of Warranty Period
                  </Button>}
                  
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
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>Bitcoin will do to banks what email did to the postal industry</h2>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
