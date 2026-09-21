import { List } from '@mui/material';
import React from 'react';
import { Card, CardGroup } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

export const ExperiencePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide uppercase">
                Experiences
            </h1>
            <CardGroup className="flex flex-wrap justify-center gap-4 mt-4 mb-4 px-4">
                <Card>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Header>The journey from start to gallery</Card.Header>
                    <Card.Body>
                        {/* <Card.Title></Card.Title> */}
                        <ListGroup>
                            <ListGroup.Item>
                                <p><b>Consultation & Vision</b></p>
                                <p>We begin with an easygoing conversation over phone or coffee. We'll discuss your visual style, location options, and event timeline so we're entirely aligned before shoot day.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>The Unscripted Experience</b></p>
                                <p>No stiff posing or forced smiles. My direction is centered on natural movement and authentic prompts, creating an environment where you can simply enjoy the moment.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>Carefully Curated Delivery</b></p>
                                <p>You’ll receive a polished sneak peek gallery within 48 hours. Your full, high-resolution collection follows in an interactive digital gallery complete with print-ordering options.</p>
                            </ListGroup.Item>
                        </ListGroup>
                        {/* <Card.Text>
                        </Card.Text> */}
                    </Card.Body>
                    {/* <Card.Footer>
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer> */}
                </Card>
                <Card>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Header>What Working Together Feels Like</Card.Header>
                    <Card.Body>
                        {/* <Card.Title></Card.Title> */}
                        <ListGroup>
                            <ListGroup.Item>
                                <p><b>Planning Your Story</b></p>
                                <p>Once booked, you’ll receive a curated Style & Location Guide. We’ll coordinate wardrobe colors, timing for optimal natural light, and setting choices tailored to your style.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>A Relaxed Session</b></p>
                                <p>Think of our shoot as an hour out of your day to connect while I handle the angles. I guide you through natural interactions so everyone feels comfortable in front of the camera.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>Reliving the Moment</b></p>
                                <p>Within three weeks, your personal online gallery opens. From there, you can download high-res files, share with family, or order archival prints directly to your door.</p>
                            </ListGroup.Item>
                        </ListGroup>
                        {/* <Card.Text>
                        </Card.Text> */}
                    </Card.Body>
                    {/* <Card.Footer>
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer> */}
                </Card>
                <Card>
                    {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
                    <Card.Header>Our Production Process</Card.Header>
                    <Card.Body>
                        {/* <Card.Title></Card.Title> */}
                        <ListGroup>
                            <ListGroup.Item>
                                <p><b>Strategy & Shot Lists</b></p>
                                <p>We define brand goals, mood boards, lighting setup, and talent needs. A granular schedule ensures every required deliverable is captured efficiently.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>On-Set Execution</b></p>
                                <p>Direct tethered shooting allows real-time review of compositions and lighting adjustments on set, ensuring total alignment with your brand guidelines.</p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <p><b>Post-Production & Delivery</b></p>
                                <p>Color grading, skin retouching, and asset sizing delivered via secure cloud download with full commercial licensing documentation.</p>
                            </ListGroup.Item>
                        </ListGroup>
                        {/* <Card.Text>
                        </Card.Text> */}
                    </Card.Body>
                    {/* <Card.Footer>
                        <small className="text-muted">Last updated 3 mins ago</small>
                    </Card.Footer> */}
                </Card>
            </CardGroup>
        </div>
    )
}