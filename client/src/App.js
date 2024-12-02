import './App.css';
import { useEffect, useState } from "react"
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form, Card, Row, Col, Badge, Navbar, Alert, Modal} from 'react-bootstrap';

function App() {
  const [currentView, setCurrentView] = useState('main');

  const showCitas = () => {
    setCurrentView("citas");
  };

  const showMain = () => {
    setCurrentView('main');
  };

  const showVeterinarios = () => {
      setCurrentView("veterinarios");
  };

  const showFacturas = () => {
    setCurrentView("facturas");
  };

  const showTratamientos = () => {
    setCurrentView("tratamientos");
  };

  return (
    <Container fluid className="p-0">
      {currentView === 'main' ? (
        <>
          <Navbar bg="dark" variant="dark" className="mb-4">
            <Container>
              <Navbar.Brand>Veterinaria</Navbar.Brand>
            </Container>
          </Navbar>
          <Container className="text-center py-5">
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="shadow">
                  <Card.Body>
                    <h2 className="mb-4">Panel de Control</h2>
                    <div className="d-grid gap-3">
                      <Button variant="primary" size="lg" onClick={showCitas}>
                        Citas
                      </Button>
                      <Button variant="success" size="lg" onClick={showVeterinarios}>
                        Veterinarios
                      </Button>
                      <Button variant="info" size="lg" onClick={showFacturas}>
                        Facturas
                      </Button>
                      <Button variant="warning" size="lg" onClick={showTratamientos}>
                        Tratamientos
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      ) : currentView === 'citas' ? (
        <Citas onBack={showMain} />
      ) : currentView === 'veterinarios' ? (
        <Veterinarios onBack={showMain}/>
      ) : currentView == 'facturas' ? (
        <Facturas onBack={showMain}/>
      ) :currentView == 'tratamientos' ? (
        <Tratamientos onBack={showMain}/>
      ): null}
    </Container>
  );
}

function Citas({ onBack }){
  // Estados existentes
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] = useState("");
  const [hora, setHora] = useState("");
  const [mascotaId, setMascotaId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [citasList, setCitas] = useState([]);
  // Nuevo estado para modo edición
  const [editingCita, setEditingCita] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);

  // Función para determinar el color del badge según el estado
  const getEstadoBadgeVariant = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'warning';
      case 'confirmada': return 'success';
      case 'cancelada': return 'danger';
      case 'completada': return 'info';
      default: return 'secondary';
    }
  };

  // Obtener datos
  const getCitas = () => {
    Axios.get("http://localhost:3001/citas_completas").then((response) => {
      setCitas(response.data);
    });
  }

  useEffect(() => {
    getCitas();
    Axios.get("http://localhost:3001/mascotas-info")
      .then((response) => {
        setMascotas(response.data);
      })
      .catch(error => console.error("Error cargando mascotas", error));

    Axios.get("http://localhost:3001/veterinarios-info")
      .then((response) => {
        setVeterinarios(response.data);
      })
      .catch(error => console.error("Error cargando veterinarios:", error));
  }, []);

  // Función para agregar cita
  const add = () => {
    if(!mascotaId || !veterinarioId || !fecha || !hora || !motivo || !estado) {
      alert("Por favor complete todos los campos");
      return;
    }

    Axios.post("http://localhost:3001/create", {
      fecha: fecha,
      hora: hora,
      motivo: motivo,
      estado: estado,
      mascotas_idmascotas: mascotaId,
      veterinarios_idveterinarios: veterinarioId
    }).then(() => {
      alert("Cita Registrada");
      limpiarFormulario();
      getCitas();
    }).catch(error => {
      console.error("Error al registrar la cita: ", error);
      alert("Error al registrar la cita");
    });
  }

  // Función para actualizar cita
  const updateCita = () => {
    if (!editingCita) return;
    
    if(!mascotaId || !veterinarioId || !fecha || !hora || !motivo || !estado) {
      alert("Por favor complete todos los campos");
      return;
    }

    Axios.put(`http://localhost:3001/update-cita/${editingCita.idcitas}`, {
      fecha: fecha,
      hora: hora,
      motivo: motivo,
      estado: estado,
      mascotas_idmascotas: mascotaId,
      veterinarios_idveterinarios: veterinarioId
    }).then(() => {
      alert("Cita actualizada con éxito");
      limpiarFormulario();
      setEditingCita(null);
      getCitas();
    }).catch(error => {
      console.error("Error al actualizar la cita:", error);
      alert("Error al actualizar la cita");
    });
  };

  // Función para eliminar cita
  const deleteCita = () => {
    if (!citaToDelete) return;

    Axios.delete(`http://localhost:3001/delete-cita/${citaToDelete.idcitas}`)
      .then(() => {
        alert("Cita eliminada con éxito");
        setShowConfirmDialog(false);
        setCitaToDelete(null);
        getCitas();
      })
      .catch(error => {
        console.error("Error al eliminar la cita:", error);
        alert("Error al eliminar la cita");
      });
  };

  // Función para cargar datos en el formulario para editar
  const editCita = (cita) => {
    setEditingCita(cita);
    setFecha(cita.fecha.split('T')[0]);
    setHora(cita.hora);
    setMotivo(cita.motivo);
    setEstado(cita.estado);
    setMascotaId(cita.mascotas_idmascotas);
    setVeterinarioId(cita.veterinarios_idveterinarios);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setFecha("");
    setHora("");
    setMotivo("");
    setEstado("");
    setMascotaId("");
    setVeterinarioId("");
    setEditingCita(null);
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Gestión de Citas</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-5">
          <Col>
            <Card className="shadow">
              <Card.Body>
                <h3 className="mb-4">{editingCita ? 'Editar Cita' : 'Nueva Cita'}</h3>
                <Form>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                          type="date"
                          value={fecha}
                          onChange={(e) => setFecha(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                          type="time"
                          value={hora}
                          onChange={(e) => setHora(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                        >
                          <option value="">Seleccione un estado</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmada">Confirmada</option>
                          <option value="Cancelada">Cancelada</option>
                          <option value="Completada">Completada</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Motivo</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          placeholder="Describa el motivo de la cita"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mascota</Form.Label>
                        <Form.Select
                          value={mascotaId}
                          onChange={(e) => setMascotaId(e.target.value)}
                        >
                          <option value="">Seleccione una mascota</option>
                          {mascotas.map(mascota => (
                            <option key={mascota.idmascotas} value={mascota.idmascotas}>
                              {mascota.mascota_nombre} - {mascota.especie_nombre}
                              (Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Veterinario</Form.Label>
                        <Form.Select
                          value={veterinarioId}
                          onChange={(e) => setVeterinarioId(e.target.value)}
                        >
                          <option value="">Seleccione un Veterinario</option>
                          {veterinarios.map(vet => (
                            <option key={vet.idveterinarios} value={vet.idveterinarios}>
                              Dr(a). {vet.nombre} {vet.apellido}
                              ({vet.especialidades || 'Sin especialidad'})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-end">
                    {editingCita ? (
                      <>
                        <Button 
                          variant="success" 
                          onClick={updateCita} 
                          className="me-2"
                        >
                          Actualizar Cita
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={limpiarFormulario}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={add}>
                        Registrar Cita
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <h3 className="mb-4">Listado de Citas</h3>
            <Row>
              {citasList.map((cita) => (
                <Col key={cita.idcitas} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <Badge bg={getEstadoBadgeVariant(cita.estado)}>
                        {cita.estado}
                      </Badge>
                      <small>{new Date(cita.fecha).toLocaleDateString()} - {cita.hora}</small>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>{cita.mascota_nombre}</Card.Title>
                      <Card.Text>
                        <div>
                          <strong>Especie:</strong> {cita.especie}
                        </div>
                        <div>
                          <strong>Dueño:</strong> {cita.dueno_nombre} {cita.dueno_apellido}
                        </div>
                        <div>
                          <strong>Teléfono:</strong> {cita.dueno_telefono}
                        </div>
                        <div>
                          <strong>Veterinario:</strong> Dr(a). {cita.veterinario_nombre} {cita.veterinario_apellido}
                        </div>
                        <div>
                          <strong>Especialidad:</strong> {cita.especialidades || 'Medicina General'}
                        </div>
                        <div>
                          <strong>Motivo:</strong> {cita.motivo}
                        </div>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => editCita(cita)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          setCitaToDelete(cita);
                          setShowConfirmDialog(true);
                        }}
                      >
                        Eliminar
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showConfirmDialog} onHide={() => setShowConfirmDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            ¿Está seguro que desea eliminar esta cita?
            {citaToDelete && (
              <div className="mt-2">
                <div><strong>Fecha:</strong> {new Date(citaToDelete.fecha).toLocaleDateString()}</div>
                <div><strong>Mascota:</strong> {citaToDelete.mascota_nombre}</div>
                <div><strong>Dueño:</strong> {citaToDelete.dueno_nombre} {citaToDelete.dueno_apellido}</div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteCita}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}




function Veterinarios({onBack}){
  const [veterinarios, setVeterinarios] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/veterinarios-info")
    .then((response) => {
      setVeterinarios(response.data);
    })
    .catch(error => console.error("Error cargando veterinarios: ", error));
  }, []);

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Veterinarios</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col>
            <h3 className="mb-4">Listado de Veterinarios</h3>
            <Row>
              {veterinarios.map((vet) => (
                <Col key={vet.idveterinarios} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">Dr(a). {vet.nombre} {vet.apellido}</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <p><strong>Especialidad:</strong> {vet.especialidades || 'Medicina General'}</p>
                        <p><strong>Teléfono:</strong> {vet.telefono}</p>
                        <p><strong>Email:</strong> {vet.email}</p>
                        <p><strong>IdEspecialidad: </strong>{vet.especialidad_ids}</p>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      <small>ID: {vet.idveterinarios}</small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

function Facturas({onBack}){
  const [facturas, setFacturas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    Axios.get("http://localhost:3001/facturas-info")
    .then((response) => {
      setFacturas(response.data);
    })
    .catch(error => console.error("Error cargando facturas: ", error));
  }, []);

  const getEstadoBadgeVariant = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pagado': return 'success';
      case 'pendiente': return 'warning';
      case 'vencido': return 'danger';
      default: return 'secondary';
    }
  };

  const facturasFiltradas = facturas.filter(factura => {
    return (
      (!filtroEstado || factura.estado_pago === filtroEstado) &&
      (!filtroFechaInicio || new Date(factura.fecha_emision) >= new Date(filtroFechaInicio)) &&
      (!filtroFechaFin || new Date(factura.fecha_emision) <= new Date(filtroFechaFin)) &&
      (!busqueda || 
        factura.dueno_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        factura.dueno_apellido.toLowerCase().includes(busqueda.toLowerCase()))
    );
  });

  return(
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Facturas</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>
      <Container>
        {/* Filtros */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado de Pago</Form.Label>
                  <Form.Select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtroFechaInicio}
                    onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={filtroFechaFin}
                    onChange={(e) => setFiltroFechaFin(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Buscar Cliente</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Lista de Facturas */}
        <Row>
          {facturasFiltradas.map((factura) => (
            <Col key={factura.idfacturas} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Badge bg={getEstadoBadgeVariant(factura.estado_pago)}>
                    {factura.estado_pago}
                  </Badge>
                  <small>Factura #{factura.idfacturas}</small>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {factura.dueno_nombre} {factura.dueno_apellido}
                  </Card.Title>
                  <Card.Text>
                    <div><strong>Fecha Emisión:</strong> {new Date(factura.fecha_emision).toLocaleDateString()}</div>
                    <div><strong>Fecha Vencimiento:</strong> {new Date(factura.fecha_vencimiento).toLocaleDateString()}</div>
                    <div><strong>Método de Pago:</strong> {factura.metodo_pago}</div>
                    <div><strong>Contacto:</strong> {factura.dueno_telefono}</div>
                    <div><strong>Email:</strong> {factura.dueno_email}</div>
                    <div className="border-t border-gray-200 my-2"></div> {/* Reemplazar <hr/> */}
                    <div><strong>Subtotal:</strong> ${factura.subtotal}</div>
                    <div><strong>IVA:</strong> ${factura.iva}</div>
                    <div className="text-xl font-bold"><strong>Total:</strong> ${factura.total}</div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" size="sm" className="w-100">
                    Ver Detalles
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

function Tratamientos({onBack}) {
  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/tratamientos-mascotas")
      .then((response) => {
        setMascotas(response.data);
      })
      .catch(error => {
        console.error("Error al cargar mascotas:", error);
        setError("Error al cargar las mascotas");
      })
      .finally(() => setLoading(false));
  }, []);

  const cargarTratamientos = (idMascota) => {
    if (!idMascota) {
      setTratamientos([]);
      return;
    }
    
    setLoading(true);
    Axios.get(`http://localhost:3001/tratamientos-by-mascota/${idMascota}`)
      .then((response) => {
        setTratamientos(response.data);
      })
      .catch(error => {
        console.error("Error al cargar tratamientos:", error);
        setError("Error al cargar los tratamientos");
      })
      .finally(() => setLoading(false));
  };

  const handleMascotaChange = (e) => {
    const idMascota = e.target.value;
    setMascotaSeleccionada(idMascota);
    cargarTratamientos(idMascota);
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Consulta de Tratamientos</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <Card>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Seleccione Mascota</Form.Label>
                  {loading && mascotaSeleccionada === '' ? (
                    <div className="text-center py-2">
                      <span>Cargando mascotas...</span>
                    </div>
                  ) : (
                    <Form.Select
                      value={mascotaSeleccionada}
                      onChange={handleMascotaChange}
                    >
                      <option value="">Seleccione una mascota</option>
                      {mascotas.map(mascota => (
                        <option key={mascota.idmascotas} value={mascota.idmascotas}>
                          {mascota.mascota_nombre} - Dueño: {mascota.dueno_nombre}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {error && (
                    <Alert variant="danger" className="mt-3">
                      {error}
                    </Alert>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {loading && mascotaSeleccionada !== '' ? (
          <div className="text-center">
            <span>Cargando tratamientos...</span>
          </div>
        ) : mascotaSeleccionada ? (
          <Row>
            {tratamientos.length > 0 ? (
              tratamientos.map((tratamiento) => (
                <Col key={tratamiento.idtratamientos} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header>
                      <h6 className="mb-0">Tratamiento #{tratamiento.idtratamientos}</h6>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>{tratamiento.diagnostico}</Card.Title>
                      <Card.Text>
                        <p><strong>Fecha Inicio:</strong> {new Date(tratamiento.fecha_inicio).toLocaleDateString()}</p>
                        <p><strong>Fecha Fin:</strong> {tratamiento.fecha_fin ? new Date(tratamiento.fecha_fin).toLocaleDateString() : 'En curso'}</p>
                        <p><strong>Mascota:</strong> {tratamiento.mascota_nombre}</p>
                        <p><strong>Especie:</strong> {tratamiento.especie_nombre}</p>
                        <p><strong>Dueño:</strong> {tratamiento.dueno_nombre}</p>
                        <p><strong>Veterinario:</strong> {tratamiento.veterinario_nombre}</p>
                        <p><strong>Motivo de la cita:</strong> {tratamiento.motivo_cita}</p>
                        
                        {tratamiento.medicamentos && (
                          <>
                            <strong>Medicamentos:</strong>
                            <ul className="mt-2">
                              {tratamiento.medicamentos.split(';').map((med, index) => (
                                <li key={index}>{med.trim()}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <Alert variant="info">
                  No se encontraron tratamientos para esta mascota.
                </Alert>
              </Col>
            )}
          </Row>
        ) : (
          <Alert variant="info" className="text-center">
            Seleccione una mascota para ver sus tratamientos
          </Alert>
        )}
      </Container>
    </Container>
  );
}

export default App;