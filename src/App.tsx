import React, { Component } from "react";
import { Form, Progress, Grid, Step, Icon, Header, Table, Divider } from "semantic-ui-react"
import { google } from "googleapis";
import "./App.css";

interface AppProps {
  trackingId: string;
  result: number;
  orderDate: string;
  arrivalDate: string;
  isSubmitted: boolean;
}

class App extends Component<{}, AppProps> {
  private initialState: AppProps;
  private onSubmit: () => void;
  private onChange: (e: any, obj: any) => void;

  constructor(props: any) {
    super(props);
    
    const sheets = google.sheets({
      version: "v4",
      auth: "AIzaSyCICoHhhvNrgC7s4zU7cVcwjt_UZeRbjP8"
    });

    this.initialState = { trackingId: "", result: 0, orderDate: "", arrivalDate: "", isSubmitted: false };
    this.state = this.initialState;

    this.onChange = (e, { value }) => this.setState({ trackingId: value })
    
    this.onSubmit = () => {
      const { trackingId } = this.state;

      sheets.spreadsheets.values.get({ 
        spreadsheetId: "11O5N6091nr6swvYClTadIspXGBCFxNFTHJVUD0h0B6o",
        range: "A:D"
      }).then(res => {      
          const excelValues = res.data.values;
          console.log(JSON.stringify(excelValues));

          if (!excelValues || excelValues.length < 2) {            
            return this.setState(this.initialState);
          } else {
            for (let i = 1; i < excelValues.length; i++) {
              if (excelValues[i][0] === trackingId) {
                const result = excelValues[i][1];
                const orderDate = excelValues[i][2];      
                const arrivalDate = excelValues[i][3];               

                return this.setState({
                  trackingId: trackingId,
                  result: result,
                  isSubmitted: true,
                  orderDate: orderDate,
                  arrivalDate: arrivalDate
                });
              }
            }
          }

          return this.setState(this.initialState);
      });
    }
  }

  public componentDidMount() {}

  public render() {
    const { trackingId, result, isSubmitted, orderDate, arrivalDate } = this.state
    let header;
    if (isSubmitted) {
      header = 
        <div>
           <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={2}>Order#</Table.Cell>
                <Table.Cell>{ trackingId }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Order Date</Table.Cell>
                <Table.Cell>{ orderDate }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Estimated Arrival Date</Table.Cell>
                <Table.Cell>{ arrivalDate }</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>           
    } else {
      header = 
        <Form onSubmit={ this.onSubmit }>
          <Form.Group inline>
            <Form.Input name="trackingId" value={ trackingId } label="Order#" placeholder="123" onChange={this.onChange} />    
            <Form.Button content="Submit" />
          </Form.Group>
        </Form>;
    }
    
    return (
      <div className="App">    
        <Header
          as='h2'
          content='Order Tracker'
          subheader='ติดตามสถานะคำสั่งซื้อ'
        />   
        <Divider horizontal>
          <Header as='h4'>
            <Icon name="info" />
            Order information
          </Header>
        </Divider>
        { header }
        <Divider horizontal>
          <Header as='h4'>
            <Icon name="shipping fast" />
            Status
          </Header>
        </Divider>
        <Grid columns={1}>
          <Grid.Column>
            <Step.Group fluid vertical>
              <Step completed={ result >= 1 } disabled={ result < 1 }>
                <Icon name="pencil alternate" />
                <Step.Content>
                  <Step.Title>Initiated</Step.Title>
                  <Step.Description>สร้างคำสั่งซื้อ</Step.Description>
                </Step.Content>
              </Step>
              <Step completed={ result >= 2 } disabled={ result < 2 }>
                <Icon name="box" />
                <Step.Content>
                  <Step.Title>Order Processed</Step.Title>
                  <Step.Description>จัดซื้อสินค้าแล้ว</Step.Description>
                </Step.Content>
              </Step>
              <Step completed={ result >= 3 } disabled={ result < 3 }>
                <Icon name="warehouse" />
                <Step.Content>
                  <Step.Title>Arrived at shipping cargo</Step.Title>
                  <Step.Description>ของถึงคลังสินค้า</Step.Description>
                </Step.Content>
              </Step>
              <Step completed={ result >= 4 } disabled={ result < 4 }>
                <Icon name="plane" />
                <Step.Content>
                  <Step.Title>Shipped to Thailand</Step.Title>
                  <Step.Description>ของถูกส่งไปประเทศไทย</Step.Description>
                </Step.Content>
              </Step>       
              <Step completed={ result >= 5 } disabled={ result < 5 }>
                <Icon name="map marker alternate" />
                <Step.Content>
                  <Step.Title>Arrived Thailand</Step.Title>
                  <Step.Description>ของถึงประเทศไทย รอทางร้านติดต่อนัดรับ/จัดส่งไม่เกิน1วัน</Step.Description>
                </Step.Content>
              </Step> 
              <Step completed={ result >= 6 } disabled={ result < 6 }>
                <Icon name="clipboard check" />
                <Step.Content>
                  <Step.Title>Completed</Step.Title>
                  <Step.Description>จัดส่งเรียบร้อย</Step.Description>
                </Step.Content>
              </Step> 
            </Step.Group>
          </Grid.Column>        
        </Grid>
      </div>
    );
  }
}
  
export default App;
