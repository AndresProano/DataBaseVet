import './App.css';
import { useEffect, useState, useSyncExternalStore } from "react"
import Axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form, Card, Row, Col, Badge, Navbar, Alert, Modal, Spinner} from 'react-bootstrap';

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

  const showAddMascotas = () => {
    setCurrentView("mascotas");
  }

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
                      <Button variant="primary" size='lg' onClick={showAddMascotas}>
                        Mascotas
                      </Button>
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
      ) :currentView == 'mascotas' ? (
        <Mascotas onBack={showMain}/>
      ) : null}
    </Container>
  );
}

function Mascotas({onBack}) {
  const [mascotaId, setMascotaId] =useState("");
  const [nombre, setNombre] = useState("");
  const [fechaDeNacimiento, setfechaDeNacimiento] = useState("");
  const [peso, setPeso] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [duenoId, setDuenoId] = useState("");

  const [especies, setEspecies] = useState([]);
  const [duenos, setDuenos] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  const [showEspecieModal, setShowEspecieModal] = useState(false);
  const [showDuenoModal, setShowDuenoModal] = useState(false);

  const [editingMascota, setEditingMascota] = useState(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [mascotaToDelete, setMascotaToDelete] = useState(null);

  const [nuevaEspecie, setNuevaEspecie] = useState({
    nombre: "",
    descripcion: ""
  });

  const [nuevoDueno, setNuevoDueno] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: ""
  });

  useEffect(() => {
    cargarEspecies();
    cargarDuenos();
    cargarMascotas();
  }, []);

  const cargarEspecies = () => {
    Axios.get("http://localhost:3001/especies")
    .then(response => setEspecies(response.data))
    .catch(error => console.error("Error cargando especies: ", error));
  };

  const deleteMascota = () => {
    if (!mascotaToDelete) return;

    Axios.delete(`http://localhost:3001/delete-mascota/${mascotaToDelete.idmascotas}`)
      .then(() => {
        alert("Mascota eliminada con éxito");
        setShowConfirmDialog(false);
        setMascotaToDelete(null);
        cargarMascotas();
      })
      .catch(error => {
        console.error("Error al eliminar la mascota:", error);
        alert("Error al eliminar la mascota");
      });
  };

  const cargarDuenos = () => {
    Axios.get("http://localhost:3001/duenos")
    .then(response => setDuenos(response.data))
    .catch(error => console.error("Error cargando duenos: ", error));
  };

  const cargarMascotas = () => {
    Axios.get("http://localhost:3001/mascotas-info")
    .then(response => setMascotas(response.data))
    .catch(error => console.error("Error cargando mascotas: ", error));
  };

  const limpiarFormularioMascota = () => {
    setNombre("");
    setfechaDeNacimiento("");
    setPeso("");
    setEspecieId("");
    setDuenoId("");
    setEditingMascota(null);
  };

  const agregarMascota = () => {
    if (!nombre || !fechaDeNacimiento || !peso || !especieId || !duenoId) {
      alert("Por favor complete todos los campos");
      return;
    }
  
    const mascotaData = {
      nombre,
      fechanacimiento: fechaDeNacimiento,
      peso: Number(peso),
      especies_idespecies: Number(especieId),
      duenos_idduenos: Number(duenoId)
    };
  
    console.log("Datos a enviar:", mascotaData);
    console.log("Tipo de datos:", {
      peso: typeof mascotaData.peso,
      especies_idespecies: typeof mascotaData.especies_idespecies,
      duenos_idduenos: typeof mascotaData.duenos_idduenos
    });
  
    Axios.post("http://localhost:3001/create-mascota", mascotaData)
      .then((response) => {
        console.log("Respuesta exitosa:", response.data);
        alert("Mascota registrada exitosamente");
        limpiarFormularioMascota();
        cargarMascotas();
      })
      .catch(error => {
        console.error("Error completo:", error);
        console.error("Datos del error:", error.response?.data);
        console.error("Datos que se intentaron enviar:", mascotaData);
        alert(`Error al registrar la mascota: ${error.response?.data?.error || error.message}`);
      });
  };

  const agregarEspecie = () => {
    if (!nuevaEspecie.nombre) {
      alert("Por favor ingrese el nombre de la especie");
      return;
    }

    Axios.post("http://localhost:3001/create-especie", nuevaEspecie)
      .then(() => {
        alert("Especie registrada exitosamente");
        setShowEspecieModal(false);
        cargarEspecies();
        setNuevaEspecie({ nombre: "", descripcion: "" });
      })
      .catch(error => {
        console.error("Error al registrar especie:", error);
        alert("Error al registrar la especie");
      });
  };

  const agregarDueno = () => {
    if (!nuevoDueno.nombre || !nuevoDueno.apellido || !nuevoDueno.telefono) {
      alert("Por favor complete los campos obligatorios");
      return;
    }

    Axios.post("http://localhost:3001/create-dueno", nuevoDueno)
      .then(() => {
        alert("Dueño registrado exitosamente");
        setShowDuenoModal(false);
        cargarDuenos();
        setNuevoDueno({
          nombre: "",
          apellido: "",
          telefono: "",
          email: "",
          direccion: ""
        });
      })
      .catch(error => {
        console.error("Error al registrar dueño:", error);
        alert("Error al registrar el dueño");
      });
  };

  const updateMascota = () => {
    if (!editingMascota) return;
    
    if (!nombre || !fechaDeNacimiento || !peso || !especieId || !duenoId) {
      alert("Por favor complete todos los campos");
      return;
  }

  Axios.put(`http://localhost:3001/update-mascota/${editingMascota.idmascotas}`, {
      nombre: nombre,
      fechanacimiento: fechaDeNacimiento,
      peso: peso,
      especies_idespecies: especieId,
      duenos_idduenos: duenoId
  }).then(() => {
      alert("Mascota actualizada con éxito");
      limpiarFormularioMascota();
      setEditingMascota(null);
      cargarMascotas();
  }).catch(error => {
      console.error("Error al actualizar la mascota:", error);
      alert("Error al actualizar la mascota");
  });
};

const editMascota = (mascota) => {
  setEditingMascota(mascota);
  setNombre(mascota.mascota_nombre);
  setfechaDeNacimiento(mascota.fechanacimiento.split('T')[0]);
  setPeso(mascota.peso);
  setEspecieId(mascota.idespecies);
  setDuenoId(mascota.idduenos);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  return(
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Gestión de Mascotas</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>

      <Container>
        <Row className="mb-5">
          <Col>
            <Card className="shadow">
              <Card.Body>
                <h3 className="mb-4">{editingMascota ? 'Editar Mascota' : 'Nueva Mascota'}</h3>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Nombre de la mascota"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          value={fechaDeNacimiento}
                          onChange={(e) => setfechaDeNacimiento(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Peso (kg)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={peso}
                          onChange={(e) => setPeso(e.target.value)}
                          placeholder="Peso en kg"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Especie</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Select
                            value={especieId}
                            onChange={(e) => setEspecieId(e.target.value)}
                          >
                            <option value="">Seleccione una especie</option>
                            {especies.map(especie => (
                              <option key={especie.idespecies} value={especie.idespecies}>
                                {especie.nombre}
                              </option>
                            ))}
                          </Form.Select>
                          <Button variant="outline-primary" onClick={() => setShowEspecieModal(true)}>
                            +
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Dueño</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Select
                            value={duenoId}
                            onChange={(e) => setDuenoId(e.target.value)}
                          >
                            <option value="">Seleccione un dueño</option>
                            {duenos.map(dueno => (
                              <option key={dueno.idduenos} value={dueno.idduenos}>
                                {dueno.nombre} {dueno.apellido}
                              </option>
                            ))}
                          </Form.Select>
                          <Button variant="outline-primary" onClick={() => setShowDuenoModal(true)}>
                            +
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-end">
                    {editingMascota ? (
                      <>
                        <Button 
                          variant="success" 
                          onClick={updateMascota} 
                          className="me-2"
                        >
                          Actualizar Mascota
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={limpiarFormularioMascota}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={agregarMascota}>
                        Registrar Mascota
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Lista de Mascotas */}
        <Row>
          <Col>
            <h3 className="mb-4">Listado de Mascotas</h3>
            <Row>
              {mascotas.map((mascota) => (
                <Col key={mascota.idmascotas} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header>
                      <h5 className="mb-0">{mascota.mascota_nombre}</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <div><strong>Nombre:</strong> {mascota.mascota_nombre}</div>
                        <div><strong>Especie:</strong> {mascota.especie_nombre}</div>
                        <div><strong>Fecha de Nacimiento:</strong> {new Date(mascota.fechanacimiento).toLocaleDateString()}</div>
                        <div><strong>Peso:</strong> {mascota.peso} kg</div>
                        <div><strong>Dueño:</strong> {mascota.dueno_nombre} {mascota.dueno_apellido}</div>
                        <div><strong>Contacto:</strong> {mascota.dueno_telefono}</div>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className = "d-flex justify-content-end gap-2">
                      <Button variant="outline-primary"
                        size="sm"
                        onClick={() => editMascota(mascota)}>Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          setMascotaToDelete(mascota);
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

        {/* Modal de confirmación para eliminar */}
      <Modal show={showConfirmDialog} onHide={() => setShowConfirmDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            ¿Está seguro que desea eliminar esta mascota?
            {mascotaToDelete && (
              <div className="mt-2">
                <div><strong>Mascota:</strong> {mascotaToDelete.mascota_nombre}</div>
                <div><strong>Fecha de nacimiento:</strong> {new Date(mascotaToDelete.fechanacimiento).toLocaleDateString()}</div>
                <div><strong>Peso:</strong> {mascotaToDelete.peso} kg</div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteMascota}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

        {/* Modal Nueva Especie */}
        <Modal show={showEspecieModal} onHide={() => setShowEspecieModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Especie</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nuevaEspecie.nombre}
                  onChange={(e) => setNuevaEspecie({...nuevaEspecie, nombre: e.target.value})}
                  placeholder="Nombre de la especie"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={nuevaEspecie.descripcion}
                  onChange={(e) => setNuevaEspecie({...nuevaEspecie, descripcion: e.target.value})}
                  placeholder="Descripción de la especie"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEspecieModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={agregarEspecie}>
              Guardar Especie
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Nuevo Dueño */}
        <Modal show={showDuenoModal} onHide={() => setShowDuenoModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nuevo Dueño</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre*</Form.Label>
                    <Form.Control
                      type="text"
                      value={nuevoDueno.nombre}
                      onChange={(e) => setNuevoDueno({...nuevoDueno, nombre: e.target.value})}
                      placeholder="Nombre"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido*</Form.Label>
                    <Form.Control
                      type="text"
                      value={nuevoDueno.apellido}
                      onChange={(e) => setNuevoDueno({...nuevoDueno, apellido: e.target.value})}
                      placeholder="Apellido"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono*</Form.Label>
                <Form.Control
                  type="tel"
                  value={nuevoDueno.telefono}
                  onChange={(e) => setNuevoDueno({...nuevoDueno, telefono: e.target.value})}
                  placeholder="Teléfono"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={nuevoDueno.email}
                  onChange={(e) => setNuevoDueno({...nuevoDueno, email: e.target.value})}
                  placeholder="Email"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={nuevoDueno.direccion}
                  onChange={(e) => setNuevoDueno({...nuevoDueno, direccion: e.target.value})}
                  placeholder="Dirección"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDuenoModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={agregarDueno}>
              Guardar Dueño
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
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
    if (!estado) return 'secondary';
    
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
    Axios.get("http://localhost:3001/citas_completas")
      .then((response) => {
        console.log("Citas cargadas:", response.data);
        setCitas(response.data);
      })
      .catch(error => console.error("Error cargando citas:", error));
  }

  useEffect(() => {
    getCitas();
    
    // Cargar mascotas
    Axios.get("http://localhost:3001/mascotas-info")
      .then((response) => {
        console.log("Mascotas cargadas:", response.data);
        setMascotas(response.data);
      })
      .catch(error => console.error("Error cargando mascotas:", error));

    // Cargar veterinarios
    Axios.get("http://localhost:3001/veterinarios-info")
      .then((response) => {
        console.log("Veterinarios cargados:", response.data);
        setVeterinarios(response.data);
      })
      .catch(error => console.error("Error cargando veterinarios:", error));
  }, []);

  useEffect(() => {
    if (editingCita) {
      console.log("Estado actual de selectores:", {
        mascotaIdSeleccionado: mascotaId,
        veterinarioIdSeleccionado: veterinarioId,
        mascotasDisponibles: mascotas.map(m => ({id: m.idmascotas, nombre: m.mascota_nombre})),
        veterinariosDisponibles: veterinarios.map(v => ({id: v.idveterinarios, nombre: v.nombre}))
      });
    }
  }, [mascotaId, veterinarioId, editingCita, mascotas, veterinarios]);

  // Función para agregar cita
  const add = () => {
    if(!mascotaId || !veterinarioId || !fecha || !hora || !motivo || !estado) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Validate estado value before submission
    const validEstados = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
    if (!validEstados.includes(estado)) {
      alert("Por favor seleccione un estado válido");
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
    console.log("Iniciando edición de cita:", cita);
    
    // Establecer los valores básicos primero
    setEditingCita(cita);
    setFecha(cita.fecha.split('T')[0]);
    setHora(cita.hora);
    setMotivo(cita.motivo);
    setEstado(cita.estado);
  
    // Encontrar la mascota que coincida con el nombre y datos del dueño
    const matchingMascota = mascotas.find(m => 
      m.mascota_nombre === cita.mascota_nombre && 
      m.dueno_nombre === cita.dueno_nombre && 
      m.dueno_apellido === cita.dueno_apellido
    );
  
    // Encontrar el veterinario que coincida con nombre y apellido
    const matchingVeterinario = veterinarios.find(v => 
      v.nombre === cita.veterinario_nombre && 
      v.apellido === cita.veterinario_apellido
    );
  
    console.log("Mascota encontrada:", matchingMascota);
    console.log("Veterinario encontrado:", matchingVeterinario);
  
    // Solo establecer los IDs si se encontraron las coincidencias
    if (matchingMascota) {
      console.log("Estableciendo ID de mascota:", matchingMascota.idmascotas);
      setMascotaId(matchingMascota.idmascotas.toString());
    } else {
      console.warn("No se encontró la mascota correspondiente");
    }
  
    if (matchingVeterinario) {
      console.log("Estableciendo ID de veterinario:", matchingVeterinario.idveterinarios);
      setVeterinarioId(matchingVeterinario.idveterinarios.toString());
    } else {
      console.warn("No se encontró el veterinario correspondiente");
    }
  
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
                          onChange={(e) => {
                            console.log("Seleccionando mascota:", e.target.value);
                            setMascotaId(e.target.value);
                          }}
                        >
                          <option value="">Seleccione una mascota</option>
                          {mascotas.map(mascota => {
                            const optionValue = mascota.idmascotas.toString();
                            return (
                              <option key={optionValue} value={optionValue}>
                                {mascota.mascota_nombre} - {mascota.especie_nombre}
                                (Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido})
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Veterinario</Form.Label>
                        <Form.Select
                          value={veterinarioId}
                          onChange={(e) => {
                            console.log("Seleccionando veterinario:", e.target.value);
                            setVeterinarioId(e.target.value);
                          }}
                        >
                          <option value="">Seleccione un Veterinario</option>
                          {veterinarios.map(vet => {
                            const optionValue = vet.idveterinarios.toString();
                            return (
                              <option key={optionValue} value={optionValue}>
                                Dr(a). {vet.nombre} {vet.apellido}
                                ({vet.especialidades || 'Sin especialidad'})
                              </option>
                            );
                          })}
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
    </Container>
  );
}

function Veterinarios({onBack}) {
  const [veterinarios, setVeterinarios] = useState([]);
  const [idveterinarios, setIdVeterinarios] = useState(Number);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [editingVeterinarios, setEditingVeterinario] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [veterinarioToDelete, setVeterinarioToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEspecialidadForm, setShowEspecialidadForm] = useState(false);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevosAniosRequeridos, setNuevosAniosRequeridos] = useState("");

  useEffect(() => {
    getVeterinarios();
    getEspecialidades();
  }, []);

  const getVeterinarios = () => {
    Axios.get("http://localhost:3001/veterinarios-info")
        .then((response) => {
            console.log("Datos de veterinarios recibidos:", response.data);
            setVeterinarios(response.data);
        })
        .catch(error => {
            console.error("Error cargando veterinarios: ", error);
            alert("Error al cargar la lista de veterinarios");
        });
};

  const getEspecialidades = () => {
    Axios.get("http://localhost:3001/especialidades")
      .then((response) => {
        setEspecialidades(response.data);
      })
      .catch(error => console.error("Error cargando especialidades: ", error));
  };

  const agregarEspecialidad = () => {
    if (!nuevaEspecialidad || !nuevaDescripcion || !nuevosAniosRequeridos) {
      alert("Por favor complete todos los campos de la especialidad");
      return;
    }

    // Validar que años requeridos sea un número
    const aniosNum = parseInt(nuevosAniosRequeridos);
    if (isNaN(aniosNum)) {
      alert("Los años requeridos deben ser un número");
      return;
    }

    Axios.post("http://localhost:3001/create-especialidad", {
      nombre: nuevaEspecialidad,
      descripcion: nuevaDescripcion,
      anios_requeridos: aniosNum
    }).then((response) => {
      alert("Especialidad creada con éxito");
      setNuevaEspecialidad("");
      setNuevaDescripcion("");
      setNuevosAniosRequeridos("");
      setShowEspecialidadForm(false);
      getEspecialidades();
    }).catch(error => {
      console.error("Error al crear especialidad: ", error);
      alert("Error al crear especialidad");
    });
  };

  const agregarVeterinario = () => {
    if(!nombre || !apellido || !telefono || !email || !selectedEspecialidad) {
      alert("Por favor complete todos los campos");
      return;
    }
  
    // Encontrar la especialidad seleccionada
    const especialidadSeleccionada = especialidades.find(esp => 
      esp.idespecialidad.toString() === selectedEspecialidad.toString()
    );
  
    if (!especialidadSeleccionada) {
      alert("Error: No se encontró la especialidad seleccionada");
      return;
    }
  
    Axios.post("http://localhost:3001/create-veterinario", {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      email: email,
      especialidades: especialidadSeleccionada.nombre,
      especialidad_ids: especialidadSeleccionada.idespecialidad
    }).then(() => {
      alert("Veterinario Registrado");
      limpiarFormulario();
      getVeterinarios();
      setShowForm(false);
    }).catch(error => {
      console.error("Error al registrar veterinario: ", error);
      alert("Error al registrar veterinario");
    });
  };

  const updateVeterinarios = () => {
    if (!editingVeterinarios) return;
    if(!nombre || !apellido || !telefono || !email || !selectedEspecialidad) {
        alert("Por favor complete todos los campos");
        return;
    }

    const updateData = {
        nombre,
        apellido,
        telefono,
        email,
        especialidad_ids: parseInt(selectedEspecialidad, 10)
    };

    console.log("Datos a enviar:", updateData);

    Axios.put(`http://localhost:3001/update-veterinario/${editingVeterinarios.idveterinarios}`, updateData)
        .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            alert("Veterinario actualizado con éxito");
            limpiarFormulario();
            setEditingVeterinario(null);
            getVeterinarios();
            setShowForm(false);
        })
        .catch(error => {
            console.error("Error detallado:", error.response?.data || error);
            alert(error.response?.data?.details || "Error al actualizar veterinario");
        });
};

  const deleteVeterinario = () => {
    if (!veterinarioToDelete) return;
    
    Axios.delete(`http://localhost:3001/delete-veterinario/${veterinarioToDelete.idveterinarios}`)
      .then(() => {
        alert("Veterinario eliminado con éxito");
        setShowConfirmDialog(false);
        setVeterinarioToDelete(null);
        getVeterinarios();
      })
      .catch(error => {
        console.error("Error al eliminar veterinario:", error);
        alert("Error al eliminar veterinario");
      });
  };

  const editVeterinario = (veterinario) => {
    console.log("Editando veterinario:", veterinario);
    setEditingVeterinario(veterinario);
    setNombre(veterinario.nombre || '');
    setApellido(veterinario.apellido || '');
    setTelefono(veterinario.telefono || '');
    setEmail(veterinario.email || '');
    
    // Get the specialty ID from veterinarios_has_especialidad
    Axios.get(`http://localhost:3001/veterinario-especialidad/${veterinario.idveterinarios}`)
        .then(response => {
            if (response.data && response.data.length > 0) {
                setSelectedEspecialidad(response.data[0].especialidad_idespecialidad.toString());
            }
        })
        .catch(error => {
            console.error("Error obteniendo especialidad:", error);
        });
    
    setShowForm(true);
};

  const limpiarFormulario = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setEmail("");
    setSelectedEspecialidad("");
    setEditingVeterinario(null);
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Veterinarios</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>
  
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Listado de Veterinarios</h3>
          <Button variant="outline-primary" onClick={() => setShowForm(true)}>
            Agregar Veterinario
          </Button>
        </div>
  
        <Row>
          {veterinarios.map((vet) => (
            <Col key={vet.idveterinarios} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Dr(a). {vet.nombre} {vet.apellido}</h5>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <p><strong>Especialidad:</strong> {vet.especialidades || 'No especificada'}</p>
                    <p><strong>Teléfono:</strong> {vet.telefono}</p>
                    <p><strong>Email:</strong> {vet.email}</p>
                  </Card.Text>
                  <div className="d-flex justify-content-end gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => editVeterinario(vet)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        setVeterinarioToDelete(vet);
                        setShowConfirmDialog(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
  
        {/* Modal de Formulario Veterinario */}
        <Modal show={showForm} onHide={() => {
          setShowForm(false);
          limpiarFormulario();
        }}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingVeterinarios ? 'Editar Veterinario' : 'Agregar Veterinario'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese nombre"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Ingrese apellido"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ingrese teléfono"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingrese email"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Especialidad</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={selectedEspecialidad}
                    onChange={(e) => setSelectedEspecialidad(e.target.value)}
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades.map((esp) => (
                      <option key={esp.idespecialidad} value={esp.idespecialidad}>
                        {esp.nombre} - {esp.descripcion} ({esp.anios_requeridos} años req.)
                      </option>
                    ))}
                  </Form.Select>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowEspecialidadForm(true)}
                  >
                    Nueva
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowForm(false);
              limpiarFormulario();
            }}>
              Cancelar
            </Button>
            <Button 
              variant="outline-success" 
              onClick={editingVeterinarios ? updateVeterinarios : agregarVeterinario}
            >
              {editingVeterinarios ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal para Nueva Especialidad */}
        <Modal show={showEspecialidadForm} onHide={() => {
          setShowEspecialidadForm(false);
          setNuevaEspecialidad("");
          setNuevaDescripcion("");
          setNuevosAniosRequeridos("");
        }}>
          <Modal.Header closeButton>
            <Modal.Title>Nueva Especialidad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Especialidad</Form.Label>
                <Form.Control
                  type="text"
                  value={nuevaEspecialidad}
                  onChange={(e) => setNuevaEspecialidad(e.target.value)}
                  placeholder="Ingrese el nombre de la especialidad"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Ingrese la descripción de la especialidad"
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Años Requeridos</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={nuevosAniosRequeridos}
                  onChange={(e) => setNuevosAniosRequeridos(e.target.value)}
                  placeholder="Ingrese los años requeridos"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowEspecialidadForm(false);
              setNuevaEspecialidad("");
              setNuevaDescripcion("");
              setNuevosAniosRequeridos("");
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={agregarEspecialidad}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal de Confirmación para Eliminar */}
        <Modal show={showConfirmDialog} onHide={() => setShowConfirmDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro que desea eliminar este veterinario?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={deleteVeterinario}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
}

function Facturas({onBack}){
  const [fecha_emision, setFechaEmision] = useState("");
  const [fecha_vencimiento, setFechaVencimiento] = useState ("");
  const [subtotal, setSubtotal] = useState ("");
  const [iva, setIva] = useState ("");
  const [total, setTotal] = useState ("");
  const [estado_pago, setEstadoPago] = useState ("");
  const [metodo_pago, setMetodoPago] = useState ("");

  const [facturas, setFacturas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [editingFactura, setEditingFactura] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [facturaToDelete, setFacturaToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [duenos, setDuenos] = useState([]);
  const [selectedDueno, setSelectedDueno] = useState("");

  useEffect(() => {
    getFacturas();
    getDuenos();
  }, []);

  const getDuenos = () => {
    Axios.get("http://localhost:3001/duenos")
      .then((response) => {
        setDuenos(response.data);
      })
      .catch(error => console.error("Error cargando clientes: ", error));
  };

  const getFacturas = () => {
    Axios.get("http://localhost:3001/facturas-info")
    .then((response) => {
      setFacturas(response.data);
    })
    .catch(error => console.error("Error cargando facturas: ", error));
  }

  const getEstadoBadgeVariant = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pagado': return 'success';
      case 'pendiente': return 'warning';
      case 'vencido': return 'danger';
      default: return 'secondary';
    }
  };

  const facturasFiltradas = facturas.filter(factura => {
    const fechaEmision = factura.fecha_emision ? new Date(factura.fecha_emision) : null;
    const fechaInicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
    const fechaFin = filtroFechaFin ? new Date(filtroFechaFin) : null;
    
    if (fechaEmision) {
      fechaEmision.setHours(0, 0, 0, 0);
    }
    if (fechaInicio) {
      fechaInicio.setHours(0, 0, 0, 0);
    }
    if (fechaFin) {
      fechaFin.setHours(0, 0, 0, 0);
    }
  
    const cumpleEstado = !filtroEstado || factura.estado_pago.toLowerCase() === filtroEstado.toLowerCase();
  
    const cumpleFechaInicio = !fechaInicio || (fechaEmision && fechaEmision >= fechaInicio);
    const cumpleFechaFin = !fechaFin || (fechaEmision && fechaEmision <= fechaFin);
  
    const terminoBusqueda = busqueda.toLowerCase();
    const cumpleBusqueda = !busqueda || (
      (factura.dueno_nombre && factura.dueno_nombre.toLowerCase().includes(terminoBusqueda)) ||
      (factura.dueno_apellido && factura.dueno_apellido.toLowerCase().includes(terminoBusqueda))
    );
  
    return cumpleEstado && cumpleFechaInicio && cumpleFechaFin && cumpleBusqueda;
  });

  const agregarFactura = () => {
    if(!fecha_emision || !fecha_vencimiento || !subtotal || !iva || 
       !total || !estado_pago || !metodo_pago || !selectedDueno) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    Axios.post("http://localhost:3001/create-factura", {
      fecha_emision,
      fecha_vencimiento,
      subtotal,
      iva,
      total,
      estado_pago,
      metodo_pago,
      duenos_idduenos: selectedDueno
    }).then(() => {
      alert("Factura Registrada");
      limpiarFormulario();
      getFacturas();
      setShowForm(false);
    }).catch(error => {
      console.error("Error al registrar factura: ", error);
      alert("Error al registrar factura");
    });
  };

  const updateFactura = () => {
    if (!editingFactura) return;
    if(!fecha_emision || !fecha_vencimiento || !subtotal || !iva || !total || !estado_pago || !metodo_pago) {
      alert("Por favor complete todos los campos");
      return;
    }

    Axios.put(`http://localhost:3001/update-factura/${editingFactura.idfacturas}`, {
      fecha_emision: fecha_emision,
      fecha_vencimiento: fecha_vencimiento,
      subtotal:subtotal,
      iva:iva,
      total:total,
      estado_pago:estado_pago,
      metodo_pago:metodo_pago
    }).then(() => {
      alert("Factura actualizado con éxito");
      limpiarFormulario();
      setEditingFactura(null);
      getFacturas();
      setShowForm(false);
    }).catch(error => {
      console.error("Error al actualizar factura:", error);
      alert("Error al actualizar factura");
    });
  };

  const deleteFactura = () => {
    if (!facturaToDelete) return;
    
    Axios.delete(`http://localhost:3001/delete-factura/${facturaToDelete.idfacturas}`)
      .then(() => {
        alert("Factura eliminado con éxito");
        setShowConfirmDialog(false);
        setFacturaToDelete(null);
        getFacturas();
      })
      .catch(error => {
        console.error("Error al eliminar factura:", error);
        alert("Error al eliminar factura");
      });
  };

  const editFactura = (factura) => {
    setEditingFactura(factura);
    setFechaEmision(factura.fecha_emision.split('T')[0]);
    setFechaVencimiento(factura.fecha_vencimiento.split('T')[0]);
    setSubtotal(factura.subtotal);
    setIva(factura.iva);
    setTotal(factura.total);
    setEstadoPago(factura.estado_pago);
    setMetodoPago(factura.metodo_pago);
    setShowForm(true);
  };

  const limpiarFormulario = () => {
    setEditingFactura(null);
    setFechaEmision("");
    setFechaVencimiento("");
    setSubtotal("");
    setIva("");
    setTotal("");
    setEstadoPago("");
    setMetodoPago("");
    setSelectedDueno("");
  };

  return(
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Facturas</Navbar.Brand>
          <Button variant="outline-light" onClick={onBack}>Regresar</Button>
        </Container>
      </Navbar>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Gestión de Facturas</h3>
          <Button variant="outline-primary" onClick={() => setShowForm(true)}>
            Nueva Factura
          </Button>
        </div>
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
                    <option value="pagada">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencido">Vencido</option>
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
                  <div className="d-flex justify-content-between gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => editFactura(factura)}
                      className="flex-grow-1"
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        setFacturaToDelete(factura);
                        setShowConfirmDialog(true);
                      }}
                      className="flex-grow-1"
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal de Formulario */}
        <Modal show={showForm} onHide={() => {
          setShowForm(false);
          limpiarFormulario();
        }}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingFactura ? 'Editar Factura' : 'Nueva Factura'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select
                  value={selectedDueno}
                  onChange={(e) => setSelectedDueno(e.target.value)}
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {duenos.map(dueno => (
                    <option key={dueno.idduenos} value={dueno.idduenos}>
                      {dueno.nombre} {dueno.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Emisión</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_emision}
                      onChange={(e) => setFechaEmision(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Vencimiento</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_vencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtotal</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={subtotal}
                      onChange={(e) => setSubtotal(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>IVA</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={iva}
                      onChange={(e) => setIva(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado de Pago</Form.Label>
                    <Form.Select
                      value={estado_pago}
                      onChange={(e) => setEstadoPago(e.target.value)}
                    >
                      <option value="">Seleccione estado</option>
                      <option value="pagado">Pagado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="vencido">Vencido</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select
                      value={metodo_pago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    >
                      <option value="">Seleccione método</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
              setShowForm(false);
              limpiarFormulario();
            }}>
              Cancelar
            </Button>
            <Button 
              variant="outline-success" 
              onClick={editingFactura ? updateFactura : agregarFactura}
            >
              {editingFactura ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de confirmación para eliminar */}
        <Modal show={showConfirmDialog} onHide={() => setShowConfirmDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro que desea eliminar esta factura?
            {facturaToDelete && (
              <div className="mt-2">
                <div><strong>Factura #:</strong> {facturaToDelete.idfacturas}</div>
                <div><strong>Cliente:</strong> {facturaToDelete.dueno_nombre} {facturaToDelete.dueno_apellido}</div>
                <div><strong>Total:</strong> ${facturaToDelete.total}</div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button variant="outline-danger" onClick={deleteFactura}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
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

  const [diagnostico, setDiagnostico] = useState("");
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");
  const [mascota_nombre, setMascota_nombre] = useState("");
  const [especie_nombre, setEspecie_nombre] = useState("");
  const [dueno_nombre, setDueno_nombre] = useState("");
  const [dueno_apellido, setDueno_apellido] = useState("");
  const [dueno_telefono, setDueno_telefono] = useState("");
  const [veterinario_nombre, setVeterinario_nombre] = useState("");
  const [veterinario_apellido, setVeterinario_apellido] = useState("");
  const [motivo_cita, setMotivo_cita] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [idMascota, setIdMascota] = useState('');
const [especieId, setEspecieId] = useState('');

  const [editingTratamiento, setEditingTratamiento] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tratamientoToDelete, setTratamientoToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [duenos, setDuenos] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [motivos, setMotivos] = useState([]);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('');
  const [duenoId, setDuenoId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [mascotaId, setMascotaId] = useState("");
  const [motivoCitaId, setMotivoCitaId] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        let mascotaData = null;
        if (idMascota) {
          const mascotaRes = await Axios.get(`http://localhost:3001/mascotas-info-tratamiento/${idMascota}`);
          mascotaData = mascotaRes.data;
        }
  
        const [mascotasRes, duenosRes, veterinariosRes, motivosRes] = await Promise.all([
          Axios.get("http://localhost:3001/mascotas-info"),
          Axios.get("http://localhost:3001/duenos"),
          Axios.get("http://localhost:3001/veterinarios-info"),
          Axios.get("http://localhost:3001/motivos-cita")
        ]);
  
        if (mascotaData) {
          setDuenoId(mascotaData.idduenos);
          setMascota_nombre(mascotaData.mascota_nombre);
          setEspecieId(mascotaData.idespecies);
        }
  
        setMascotas(mascotasRes.data);
        setDuenos(duenosRes.data);
        setVeterinarios(veterinariosRes.data);
        setMotivos(motivosRes.data);
  
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };
  
    cargarDatos();
  }, [idMascota]);

  const cargarDatosMascota = async (idMascota) => {
    try {
      const response = await Axios.get(`http://localhost:3001/mascotas-info-tratamiento/${idMascota}`);
      const mascota = response.data;
      setDuenoId(mascota.dueno_id);
      return mascota;
    } catch (error) {
      console.error("Error al cargar datos de la mascota:", error);
      setError("Error al cargar los datos de la mascota");
    }
  };

  const handleMascotaChange = async (e) => {
    const selectedId = e.target.value;
    console.log("Mascota seleccionada ID:", selectedId);
    setMascotaSeleccionada(selectedId);
    
    try {
        if (selectedId) {
            const response = await Axios.get(`http://localhost:3001/tratamientos-by-mascota/${selectedId}`);
            console.log("Tratamientos recibidos:", response.data);
            setTratamientos(response.data || []); // Aseguramos que siempre sea un array
        } else {
            setTratamientos([]);
        }
    } catch (error) {
        console.error("Error al cargar tratamientos:", error);
        setTratamientos([]);
        setError("Error al cargar los tratamientos");
    }
};

  const cargarTratamientos = (idMascota) => {
    if (!idMascota) {
        setTratamientos([]);
        return;
    }
    
    setLoading(true);
    // Asegurarnos de que el ID es un número
    const mascotaId = parseInt(idMascota);
    
    Axios.get(`http://localhost:3001/tratamientos-by-mascota/${mascotaId}`)
        .then((response) => {
            console.log("Tratamientos cargados:", response.data); // Para debugging
            setTratamientos(response.data);
        })
        .catch(error => {
            console.error("Error al cargar tratamientos:", error);
            setError("Error al cargar los tratamientos");
        })
        .finally(() => setLoading(false));
};


  const agregarTratamiento = async () => {
    if (!diagnostico || !fecha_inicio || !mascotaId || !veterinarioId || !motivoSeleccionado) {
        alert("Por favor complete todos los campos requeridos");
        return;
    }

    try {
        const datosTratamiento = {
            diagnostico,
            fecha_inicio,
            fecha_fin: fecha_fin || null,
            mascota_id: parseInt(mascotaId),
            veterinario_id: parseInt(veterinarioId),
            motivo_cita: motivoSeleccionado,
            medicamentos: medicamentos || null
        };

        console.log('Datos a enviar:', datosTratamiento);
        
        const response = await Axios.post("http://localhost:3001/create-tratamiento", datosTratamiento);
        
        alert("Tratamiento Registrado");
        limpiarFormulario();
        cargarTratamientos(mascotaSeleccionada);
        setShowForm(false);
    } catch (error) {
        console.error("Error completo:", error);
        console.error("Datos de la respuesta:", error.response?.data);
        alert("Error al registrar tratamiento: " + (error.response?.data?.details || error.message));
    }
  };

  const updateTratamiento = async () => {
    if (!editingTratamiento) return;
    if (!diagnostico || !fecha_inicio || !mascotaId || !veterinarioId || !motivoSeleccionado) {
        alert("Por favor complete todos los campos requeridos");
        return;
    }

    try {
        const datosTratamiento = {
            diagnostico,
            fecha_inicio,
            fecha_fin: fecha_fin || null,
            mascota_id: parseInt(mascotaId),
            veterinario_id: parseInt(veterinarioId),
            motivo_cita: motivoSeleccionado,
            medicamentos: medicamentos || null
        };

        console.log('Datos a enviar para actualización:', datosTratamiento);
        
        const response = await Axios.put(
            `http://localhost:3001/update-tratamiento/${editingTratamiento.idtratamientos}`,
            datosTratamiento
        );

        alert("Tratamiento actualizado con éxito");
        limpiarFormulario();
        setEditingTratamiento(null);
        cargarTratamientos(mascotaId);
        setShowForm(false);
    } catch (error) {
        console.error("Error completo:", error);
        console.error("Datos de la respuesta:", error.response?.data);
        alert("Error al actualizar tratamiento: " + (error.response?.data?.details || error.message));
    }
};

  const deleteTratamiento = async () => {
    if (!tratamientoToDelete) return;

    try {
        // Primero eliminar la relación en mascotas_has_tratamientos
        await Axios.delete(`http://localhost:3001/delete-tratamiento/${tratamientoToDelete.idtratamientos}`);
        
        alert("Tratamiento eliminado con éxito");
        setShowConfirmDialog(false);
        setTratamientoToDelete(null);
        // Usar el ID de la mascota seleccionada para recargar
        cargarTratamientos(mascotaId);
    } catch (error) {
        console.error("Error al eliminar tratamiento:", error);
        console.error("Detalles del error:", error.response?.data);
        alert("Error al eliminar tratamiento: " + (error.response?.data?.details || error.message));
    }
};

const editTratamiento = (tratamiento) => {
  setEditingTratamiento(tratamiento);
  setDiagnostico(tratamiento.diagnostico);
  setFecha_inicio(tratamiento.fecha_inicio?.split('T')[0]); 
  setFecha_fin(tratamiento.fecha_fin?.split('T')[0]); 
  setMascotaId(tratamiento.idmascotas);
  setVeterinarioId(tratamiento.idveterinarios);
  setMotivoSeleccionado(tratamiento.motivo_cita);
  setMedicamentos(tratamiento.medicamentos || '');
  setShowForm(true);
};

  const limpiarFormulario = () => {
    setEditingTratamiento(null);
    setDiagnostico("");
    setFecha_inicio("");
    setFecha_fin("");
    setMascotaId("");
    setDuenoId("");
    setVeterinarioId("");
    setMotivoSeleccionado("");
    setMedicamentos("");
  };

  return (
    <Container fluid className="p-0">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Consulta de Tratamientos</Navbar.Brand>
          <div>
            <Button 
              variant="success" 
              className="me-2" 
              onClick={() => {
                limpiarFormulario();
                setShowForm(true);
              }}
            >
              Nuevo Tratamiento
            </Button>
            <Button variant="outline-light" onClick={onBack}>
              Regresar
            </Button>
          </div>
        </Container>
      </Navbar>
  
      <Container>
        {/* Selector de mascota */}
        <Row className="mb-4">
          <Col md={6} className="mx-auto">
            <Card>
              <Card.Body>
                <Form.Group>
                  <Form.Label>Seleccione Mascota para ver sus tratamientos</Form.Label>
                  {loading ? (
                    <div className="text-center py-2">
                      <Spinner animation="border" size="sm" className="me-2" />
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
                          {mascota.mascota_nombre} - Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido}
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
  
        {/* Lista de tratamientos */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <p className="mt-2">Cargando tratamientos...</p>
          </div>
        ) : mascotaSeleccionada ? (
          <Row>
            {tratamientos.length > 0 ? (
              tratamientos.map((tratamiento) => (
                <Col key={tratamiento.idtratamientos} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-primary text-white">
                      <h6 className="mb-0">Tratamiento #{tratamiento.idtratamientos}</h6>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>{tratamiento.diagnostico}</Card.Title>
                      <Card.Text as="div">
                        <div className="mb-2">
                          <strong>Fecha Inicio:</strong> {new Date(tratamiento.fecha_inicio).toLocaleDateString()}
                        </div>
                        <div className="mb-2">
                          <strong>Fecha Fin:</strong> {tratamiento.fecha_fin ? new Date(tratamiento.fecha_fin).toLocaleDateString() : 'En curso'}
                        </div>
                        <div className="mb-2">
                          <strong>Mascota:</strong> {tratamiento.nombre_mascota}
                        </div>
                        <div className="mb-2">
                          <strong>Veterinario:</strong> {tratamiento.nombre_veterinario} {tratamiento.veterinario_apellido}
                        </div>
                        <div className="mb-2">
                          <strong>Motivo de la cita:</strong> {tratamiento.motivo_cita}
                        </div>
                        {tratamiento.medicamentos && (
                          <div className="mt-3">
                            <strong>Medicamentos:</strong>
                            <ul className="mt-2">
                              {tratamiento.medicamentos.split(';').map((med, index) => (
                                <li key={index}>{med.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2 bg-light">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => editTratamiento(tratamiento)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          setTratamientoToDelete(tratamiento);
                          setShowConfirmDialog(true);
                        }}
                      >
                        Eliminar
                      </Button>
                    </Card.Footer>
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
  
        {/* Modal de Formulario Nuevo/Editar */}
        <Modal 
          show={showForm} 
          onHide={() => {
            setShowForm(false);
            limpiarFormulario();
          }} 
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingTratamiento ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mascota</Form.Label>
                    <Form.Select
                      value={mascotaId}
                      onChange={(e) => {
                        const selectedMascotaId = e.target.value;
                        setMascotaId(selectedMascotaId);
                        // Encontrar la mascota seleccionada y establecer su dueño
                        const mascota = mascotas.find(m => m.idmascotas === parseInt(selectedMascotaId));
                        if (mascota) {
                          setDuenoId(mascota.idduenos);
                        }
                      }}
                      required
                    >
                      <option value="">Seleccione una mascota</option>
                      {mascotas.map(mascota => (
                        <option key={mascota.idmascotas} value={mascota.idmascotas}>
                          {mascota.mascota_nombre} - {mascota.especie_nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Dueño</Form.Label>
                    <Form.Control
                      type="text"
                      value={duenos.find(d => d.idduenos === parseInt(duenoId))?.nombre + ' ' + 
                             duenos.find(d => d.idduenos === parseInt(duenoId))?.apellido || ''}
                      disabled
                      placeholder="Se selecciona automáticamente"
                    />
                  </Form.Group>
                </Col>
              </Row>
  
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Veterinario</Form.Label>
                    <Form.Select
                      value={veterinarioId}
                      onChange={(e) => setVeterinarioId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione un veterinario</option>
                      {veterinarios.map(vet => (
                        <option key={vet.idveterinarios} value={vet.idveterinarios}>
                          {vet.nombre} {vet.apellido}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Motivo de la Cita</Form.Label>
                    <Form.Select
                        value={motivoSeleccionado}
                        onChange={(e) => setMotivoSeleccionado(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un motivo</option>
                        {motivos.map(motivo => (
                            <option key={motivo.idmotivos_cita} value={motivo.motivo}>
                                {motivo.motivo}
                            </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
  
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Diagnóstico</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={diagnostico}
                      onChange={(e) => setDiagnostico(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
  
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_inicio}
                      onChange={(e) => setFecha_inicio(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Fin</Form.Label>
                    <Form.Control
                      type="date"
                      value={fecha_fin}
                      onChange={(e) => setFecha_fin(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
  
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Medicamentos</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={medicamentos}
                      onChange={(e) => setMedicamentos(e.target.value)}
                      placeholder="Separar medicamentos con punto y coma (;)"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowForm(false);
                limpiarFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={editingTratamiento ? updateTratamiento : agregarTratamiento}
            >
              {editingTratamiento ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>
  
        {/* Modal de Confirmación para Eliminar */}
        <Modal show={showConfirmDialog} onHide={() => setShowConfirmDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              ¿Está seguro que desea eliminar este tratamiento?
              {tratamientoToDelete && (
                <div className="mt-2">
                  <div><strong>Diagnóstico:</strong> {tratamientoToDelete.diagnostico}</div>
                  <div><strong>Mascota:</strong> {tratamientoToDelete.mascota_nombre}</div>
                  <div><strong>Fecha Inicio:</strong> {new Date(tratamientoToDelete.fecha_inicio).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={deleteTratamiento}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
}

export default App;