import React from 'react'
import { Alert, Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormCheck, FormGroup, InputGroup, Row, Spinner } from 'react-bootstrap'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import DashBoardLoader from '../../components/ui/loading/DashBoardLoader'
import BackButton from '../../components/ui/BackButton'
import { Link } from 'react-router-dom'

const Test = () => {




  return (
    <div className='p-3'>
      <div>
        <Container
          key={Math.random()}
          className='text-light py-1 mb-3 border-0 rounded bg-secondary animate__animated'
          // onClick={() => {
          //   filteredLocker(locker)
          //   setAvailableSlot(locker.available)
          // }}
        >
          <Row className='px-0'>
            <Col className='m-auto font-85 ps-1 px-0'>Entrée parking - carrefour panaauia</Col>
            <Col xs={4}>
              <Row>
                <Col xs={2} className='px-0'>
                  <img
                    alt='Temp icon'
                    src={'https://img.icons8.com/color/512/dry.png'}
                    style={{ width: '26px' }}
                  />
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                    5
                  </span>

                  {/* <Badge bg='warning' className='rounded-pill'  >5</Badge> */}
                </Col>
                <Col xs={2} className='px-0 ms-3'>
                  <img
                    alt='Temp icon'
                    src={'https://img.icons8.com/color/512/organic-food.png'}
                    style={{ width: '26px' }}
                  />
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                    5
                  </span>

                  {/* <Badge bg='warning' className='rounded-pill'  >5</Badge> */}
                </Col>
                <Col xs={2} className='px-0 ms-3'>
                  {/* <i className='ri-blaze-fill fs-2'></i> */}
                  <img
                    alt='Temp icon'
                    src={'https://img.icons8.com/color/512/winter.png'}
                    style={{ width: '26px' }}
                  />
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  {/* <span className='badge badges rounded-pill bg-info border-2 border-secondary'>5</span> */}

                  <Badge bg='warning' className='rounded-pill'>
                    5
                  </Badge>
                </Col>
              </Row>

              {/* <Badge bg='warning' className='rounded-pill'  >5</Badge> */}
            </Col>
          </Row>
        </Container>
        <Container
          key={Math.random()}
          className='text-light py-1 mb-3 border-0 rounded bg-secondary animate__animated'
          // onClick={() => {
          //   filteredLocker(locker)
          //   setAvailableSlot(locker.available)
          // }}
        >
          <Row className='px-0'>
            <Col className='m-auto font-85 ps-1 px-0'>Entrée parking - carrefour panaauia</Col>
            <Col xs={4}>
              <Row>
                <Col xs={2} className='px-0 mx-0'>
                  <i className='ri-leaf-fill fs-2'></i>
                  {/* <Badge bg='info' className='rounded-pill'  >5</Badge> */}
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  {/* <span className='badge badges rounded-pill bg-info border-2 border-secondary'>5</span> */}

                  <Badge
                    bg='warning'
                    className='rounded-pill badges border-2 border-secondary'
                  >
                    5
                  </Badge>
                </Col>
                <Col xs={2} className='px-0 ms-2'>
                  <i className='ri-snowy-fill fs-2'></i>
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  <span className='badge badges rounded-pill bg-info border-2 border-secondary'>
                    5
                  </span>

                  {/* <Badge bg='warning' className='rounded-pill'  >5</Badge> */}
                </Col>
                <Col xs={2} className='px-0 ms-2'>
                  <i className='ri-blaze-fill fs-2'></i>
                </Col>
                <Col xs={1} className='px-0 font-85'>
                  {/* <span className='badge badges rounded-pill bg-info border-2 border-secondary'>5</span> */}

                  <Badge bg='warning' className='rounded-pill'>
                    5
                  </Badge>
                </Col>
              </Row>

              {/* <Badge bg='warning' className='rounded-pill'  >5</Badge> */}
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <InputGroup>
          <InputGroup.Text className='border-end-0 bg-secondary-500'>
            <i className='ri-inbox-archive-line text-secondary'></i>
          </InputGroup.Text>
          <Form.Control
            as='textarea'
            aria-label='textarea'
            placeholder='Saisie des produits de la commande...'
            value='produits'
            // onChange={(e) => setProducts([e.currentTarget.value])}
            required
          />
        </InputGroup>
        <div>
          <InputGroup className='my-3'>
            <InputGroup.Text id='basic-addon1' className='border-end-0 bg-secondary-500'>
              <i className='ri-shopping-basket-2-line text-secondary'></i>
            </InputGroup.Text>
            <Form.Control
              aria-label='panier'
              aria-describedby='basic-addon1'
              className='border-start-0'
              type='number'
              min={1}
              placeholder='Nombre de panier*'
              value='2'
              //   onChange={(e) => {
              //     setQty(e.currentTarget.value)
              //     newOrderRegister(
              //       orderStore.lockerId,
              //       orderStore.location,
              //       orderStore.bookingSlot,
              //       orderStore.companyId,
              //       orderStore.companyName,
              //       orderStore.lockerType,
              //       orderStore.delivererId,
              //       null,
              //       null,
              //       null,
              //       parseInt(e.currentTarget.value),
              //       ageRestriction === true ? 18 : 0
              //     )
              //   }}
              required
            />
          </InputGroup>
        </div>{' '}
      </div>
      <div>
        {/* {globalDispo > qty ? ( */}
        {/* <form onSubmit={validOrder}>
                {Array.from({ length: parseInt(qty) }).map((_, indx) => (
                  <Form.Select
                    onChange={(e) => handleChangeSelect(e, indx)}
                    aria-label='zone'
                    className='my-2'
                    required
                  >
                    <option>Zone de température - Choix n°{indx + 1}</option>
                    {chosenLocker?.map((lockers: any, index: any) => (
                      <option
                        value={JSON.stringify(lockers)}
                        className={`${
                          lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                          lockers?.slot.temperatureZone?.myKey === 'C'
                            ? 'bg-success'
                            : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                              lockers?.slot.temperatureZone?.myKey === 'F'
                            ? 'bg-info'
                            : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                                lockers?.slot.temperatureZone?.myKey === 'CA') &&
                              'bg-warning'
                        }`}
                      >
                        {lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                        lockers?.slot.temperatureZone?.myKey === 'C'
                          ? 'Zone Fraîche'
                          : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                            lockers?.slot.temperatureZone?.myKey === 'F'
                          ? 'Zone Congelée'
                          : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                              lockers?.slot.temperatureZone?.myKey === 'CA') &&
                            'Zone Ambiante'}{' '}
                        - {lockers?.slot.size}- {lockers?.available}{' '}
                        {lockers.available > 1 ? 'casiers' : 'casier'}
                      </option>
                    ))}
                  </Form.Select>
                ))}
                <InputGroup className='mb-3'>
                  <InputGroup.Text
                    id='basic-addon1'
                    className='border-end-0 bg-secondary-500'
                  >
                    <i className='ri-user-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={choosedName ? choosedName : clientName}
                    onChange={(e: any) => {
                      choosedName
                        ? setChoosedName(e.currentTarget.value)
                        : setClientName(e.currentTarget.value)
                    }}
                    placeholder='Nom du client*'
                    required
                    className='border-start-0'
                  />
                  {filteredName && filteredName?.length > 0 && (
                    <DropdownButton
                      variant='secondary'
                      title=''
                      className=''
                      id='input-group-dropdown-2'
                      align='end'
                      show={true}
                    >
                      {filteredName?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedName(user.name)
                            setChoosedEmail(user.email)
                            setFilteredName([])
                            setFilteredEmail([])
                          }}
                        >
                          <i className='ri-user-line'></i> {user.name} - {user.email}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
                </InputGroup>
                {isMsgErrorName && (
                  <Alert variant='danger' className='mt-2 py-0'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                <InputGroup className='mb-3'>
                  <InputGroup.Text
                    id='basic-addon1'
                    className='border-end-0 bg-secondary-500'
                  >
                    <i className='ri-at-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={choosedEmail ? choosedEmail : clientEmail}
                    onChange={(e: any) => {
                      choosedEmail
                        ? setChoosedEmail(e.currentTarget.value)
                        : setClientEmail(e.currentTarget.value)
                    }}
                    placeholder='Email du client*'
                    required
                    className='border-start-0'
                  />
                  {filteredEmail && filteredEmail?.length > 0 && (
                    <DropdownButton
                      variant=''
                      title=''
                      className=''
                      id='input-group-dropdown-2'
                      align='end'
                      show={true}
                    >
                      {filteredEmail?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedEmail(user.email)
                            setFilteredEmail([])
                          }}
                        >
                          {user.email}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
                </InputGroup>
                {isMsgErrorEmail &&
                  clientName &&
                  clientName?.length < 1 &&
                  choosedEmail &&
                  choosedEmail?.length < 1 && (
                    <Alert variant='danger' className='mt-2 py-0 '>
                      <InfoAlert
                        icon='ri-error-warning-line'
                        iconColor='danger'
                        message={'Ce champ est obligatoire'}
                        fontSize='font-75'
                      />
                    </Alert>
                  )}
                {availableSlot < parseInt(qty) && (
                  <AlertIsError
                    title={'Attention'}
                    msg={
                      "Vous n'avez pas assez de casiers disponibles dans la zone choisie. Réduisez le nombre de panier"
                    }
                    colorIcon='danger'
                  />
                )}
                <FormGroup className='mb- text-muted w-auto' controlId='formBasicCheckbox'>
                  <FormCheck
                    type='checkbox'
                    label="Restriction d'âge"
                    checked={ageRestriction}
                    onChange={() => setAgeRestriction(!ageRestriction)}
                  />
                </FormGroup>
                <i
                  className='ri-error-warning-line align-bottom text-warning'
                  title='avez-vous 18 ans '
                ></i>{' '}
                <span className='font-75 text-muted'>
                  Conchez la case, s'il y a des produits alcoolisés dans la commande.
                </span>
                <div className='w-100 text-end'>
                  <Button
                    type='submit'
                    className={`bg-info rounded-pill border-info text-light 
                  `}
                  >
                    {isOrderCreate && <Spinner size='sm' className='me-1' />}
                    Valider
                  </Button>
                </div>
              </form> */}
        {/* ) : ( */}
        <Alert variant='danger' className='border-3'>
          <InfoAlert
            icon='ri-error-warning-line'
            iconColor='danger'
            message={
              'Vous ne pourrez pas finaliser votre commande, vos casiers disponibles ne sont pas suffisant'
            }
            fontSize='font-75'
          />
        </Alert>
        <Button variant='secondary'>
          <i className='ri-arrow-left-line align-bottom'></i>
          <span className='ms-1 align-top'>Retour</span>
        </Button>
        {/* )} */}
      </div>
      {/* )} */}

      {/* )} */}
    </div>
  )
}

export default Test
